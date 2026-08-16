// Package config loads everything the service needs from the environment.
// No defaults for secrets — the process refuses to start rather than run
// with an empty JWT secret or DB password.
package config

import (
	"fmt"
	"os"
	"strings"
)

type Config struct {
	Port               string
	DatabaseURL        string
	JWTSecret          string
	AdminEmail         string // optional: auto-seeds the admin user on boot if set and no admin exists yet
	AdminPassword      string
	CORSAllowedOrigins []string

	MinioEndpoint  string // host:port, no scheme
	MinioAccessKey string
	MinioSecretKey string
	MinioBucket    string
	MinioUseSSL    bool
	MinioPublicURL string // public base URL files are served from (e.g. https://cdn.yourdomain.com or https://yourdomain.com/media)
}

func Load() (*Config, error) {
	c := &Config{
		Port:           getEnv("PORT", "8080"),
		DatabaseURL:    os.Getenv("DATABASE_URL"),
		JWTSecret:      os.Getenv("JWT_SECRET"),
		AdminEmail:     os.Getenv("ADMIN_EMAIL"),
		AdminPassword:  os.Getenv("ADMIN_PASSWORD"),
		MinioEndpoint:  os.Getenv("MINIO_ENDPOINT"),
		MinioAccessKey: os.Getenv("MINIO_ACCESS_KEY"),
		MinioSecretKey: os.Getenv("MINIO_SECRET_KEY"),
		MinioBucket:    getEnv("MINIO_BUCKET", "media"),
		MinioUseSSL:    getEnv("MINIO_USE_SSL", "false") == "true",
		MinioPublicURL: os.Getenv("MINIO_PUBLIC_URL"),
	}

	if origins := os.Getenv("CORS_ALLOWED_ORIGINS"); origins != "" {
		for _, o := range strings.Split(origins, ",") {
			c.CORSAllowedOrigins = append(c.CORSAllowedOrigins, strings.TrimSpace(o))
		}
	}

	var missing []string
	if c.DatabaseURL == "" {
		missing = append(missing, "DATABASE_URL")
	}
	if c.JWTSecret == "" {
		missing = append(missing, "JWT_SECRET")
	}
	if c.MinioEndpoint == "" {
		missing = append(missing, "MINIO_ENDPOINT")
	}
	if c.MinioAccessKey == "" {
		missing = append(missing, "MINIO_ACCESS_KEY")
	}
	if c.MinioSecretKey == "" {
		missing = append(missing, "MINIO_SECRET_KEY")
	}
	if c.MinioPublicURL == "" {
		missing = append(missing, "MINIO_PUBLIC_URL")
	}
	if len(c.CORSAllowedOrigins) == 0 {
		missing = append(missing, "CORS_ALLOWED_ORIGINS")
	}
	if len(missing) > 0 {
		return nil, fmt.Errorf("missing required env vars: %s", strings.Join(missing, ", "))
	}

	return c, nil
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
