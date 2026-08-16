package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"

	"portfolio-api/internal/api"
	"portfolio-api/internal/auth"
	"portfolio-api/internal/config"
	"portfolio-api/internal/db"
	"portfolio-api/internal/storage"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	slog.SetDefault(logger)

	cfg, err := config.Load()
	if err != nil {
		slog.Error("config", "error", err)
		os.Exit(1)
	}

	if err := db.Migrate(cfg.DatabaseURL); err != nil {
		slog.Error("migrate", "error", err)
		os.Exit(1)
	}
	slog.Info("migrations up to date")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	pool, err := db.Connect(ctx, cfg.DatabaseURL)
	cancel()
	if err != nil {
		slog.Error("connect db", "error", err)
		os.Exit(1)
	}
	defer pool.Close()

	if err := ensureAdminUser(context.Background(), pool, cfg.AdminEmail, cfg.AdminPassword); err != nil {
		slog.Error("seed admin user", "error", err)
		os.Exit(1)
	}

	storageClient, err := storage.New(cfg.MinioEndpoint, cfg.MinioAccessKey, cfg.MinioSecretKey,
		cfg.MinioBucket, cfg.MinioPublicURL, cfg.MinioUseSSL)
	if err != nil {
		slog.Error("connect storage", "error", err)
		os.Exit(1)
	}

	server := api.NewServer(pool, storageClient, cfg)

	httpServer := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      server.Router(),
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		slog.Info("listening", "port", cfg.Port)
		if err := httpServer.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			slog.Error("server", "error", err)
			os.Exit(1)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	slog.Info("shutting down")
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer shutdownCancel()
	if err := httpServer.Shutdown(shutdownCtx); err != nil {
		slog.Error("shutdown", "error", err)
	}
}

// ensureAdminUser creates the single admin account from ADMIN_EMAIL /
// ADMIN_PASSWORD on first boot if no admin exists yet. A no-op on every
// later boot, and a no-op entirely if those env vars aren't set (e.g. once
// you've changed the password through some other means and don't want boot
// to touch it — leave them unset).
func ensureAdminUser(ctx context.Context, pool *pgxpool.Pool, email, password string) error {
	var count int
	if err := pool.QueryRow(ctx, `SELECT count(*) FROM admin_users`).Scan(&count); err != nil {
		return err
	}
	if count > 0 {
		return nil
	}
	if email == "" || password == "" {
		slog.Warn("no admin user exists and ADMIN_EMAIL/ADMIN_PASSWORD are unset — /api/auth/login will reject everyone until one is created")
		return nil
	}

	hash, err := auth.HashPassword(password)
	if err != nil {
		return err
	}
	_, err = pool.Exec(ctx, `INSERT INTO admin_users (email, password_hash) VALUES ($1, $2)`, email, hash)
	if err != nil {
		return err
	}
	slog.Info("seeded admin user", "email", email)
	return nil
}
