package api

import (
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	chimw "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/jackc/pgx/v5/pgxpool"

	"portfolio-api/internal/auth"
	"portfolio-api/internal/config"
	"portfolio-api/internal/storage"
)

type Server struct {
	db      *pgxpool.Pool
	storage *storage.Client
	cfg     *config.Config
}

func NewServer(db *pgxpool.Pool, storage *storage.Client, cfg *config.Config) *Server {
	return &Server{db: db, storage: storage, cfg: cfg}
}

func (s *Server) Router() http.Handler {
	r := chi.NewRouter()
	r.Use(chimw.RequestID)
	r.Use(chimw.RealIP)
	r.Use(chimw.Logger)
	r.Use(chimw.Recoverer)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   s.cfg.CORSAllowedOrigins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: false, // Bearer tokens, not cookies — no credentialed CORS needed
		MaxAge:           300,
	}))

	r.Get("/healthz", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})

	r.Route("/api", func(r chi.Router) {
		// Every route below gets the standard 30s ceiling. The one
		// exception — favorite-track processing, which shells out to
		// yt-dlp/ffmpeg and can legitimately run well past that — is
		// registered after this group, with its own longer timeout, so it
		// isn't bound by this group's 30s (an inner middleware can't
		// extend a deadline an outer one already imposed).
		r.Group(func(r chi.Router) {
			r.Use(chimw.Timeout(30 * time.Second))

			r.Post("/auth/login", s.handleLogin)

			r.Get("/profile", s.handleGetProfile)

			r.Get("/experience", s.handleListExperience)

			r.Get("/projects", s.handleListProjects)
			r.Get("/projects/{id}", s.handleGetProject)

			r.Get("/education", s.handleListEducation)

			r.Get("/skills", s.handleListSkills)

			r.Get("/showcase", s.handleListShowcase)

			r.Get("/posts", s.handlePublicListPosts)
			r.Get("/posts/{slug}", s.handleGetPostBySlug)

			r.Post("/contact", s.handleSubmitContact)

			r.Route("/admin", func(r chi.Router) {
				r.Use(auth.RequireAdmin(s.cfg.JWTSecret))

				r.Put("/profile", s.handleUpdateProfile)

				r.Post("/experience", s.handleCreateExperience)
				r.Put("/experience/{id}", s.handleUpdateExperience)
				r.Delete("/experience/{id}", s.handleDeleteExperience)

				r.Post("/projects", s.handleCreateProject)
				r.Put("/projects/{id}", s.handleUpdateProject)
				r.Delete("/projects/{id}", s.handleDeleteProject)

				r.Post("/education", s.handleCreateEducation)
				r.Put("/education/{id}", s.handleUpdateEducation)
				r.Delete("/education/{id}", s.handleDeleteEducation)

				r.Post("/skills", s.handleCreateSkill)
				r.Put("/skills/{id}", s.handleUpdateSkill)
				r.Delete("/skills/{id}", s.handleDeleteSkill)

				r.Post("/showcase", s.handleCreateShowcase)
				r.Put("/showcase/{id}", s.handleUpdateShowcase)
				r.Delete("/showcase/{id}", s.handleDeleteShowcase)

				r.Get("/posts", s.handleAdminListPosts)
				r.Post("/posts", s.handleCreatePost)
				r.Put("/posts/{id}", s.handleUpdatePost)
				r.Delete("/posts/{id}", s.handleDeletePost)

				r.Get("/messages", s.handleListMessages)
				r.Patch("/messages/{id}/read", s.handleMarkMessageRead)
				r.Delete("/messages/{id}", s.handleDeleteMessage)

				r.Post("/upload", s.handleUpload)
			})
		})

		// Downloads full audio via yt-dlp and trims it with ffmpeg —
		// deliberately outside the r.Group above, with its own admin auth
		// and a longer timeout instead of the 30s everything else uses.
		r.With(auth.RequireAdmin(s.cfg.JWTSecret), chimw.Timeout(150*time.Second)).
			Post("/admin/favorite-track", s.handleProcessFavoriteTrack)
	})

	return r
}
