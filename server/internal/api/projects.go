package api

import (
	"context"
	"net/http"

	"github.com/go-chi/chi/v5"

	"portfolio-api/internal/models"
)

const projectColumns = `id, title, description, long_description, technologies, github_url,
	live_url, paper_url, image_url, featured, category, start_date, end_date, status,
	impact, metrics, sort_order, created_at, updated_at`

func scanProject(row interface{ Scan(...interface{}) error }) (models.Project, error) {
	var p models.Project
	err := row.Scan(&p.ID, &p.Title, &p.Description, &p.LongDescription, &p.Technologies,
		&p.GithubURL, &p.LiveURL, &p.PaperURL, &p.ImageURL, &p.Featured, &p.Category,
		&p.StartDate, &p.EndDate, &p.Status, &p.Impact, &p.Metrics, &p.SortOrder,
		&p.CreatedAt, &p.UpdatedAt)
	return p, err
}

func (s *Server) handleListProjects(w http.ResponseWriter, r *http.Request) {
	query := `SELECT ` + projectColumns + ` FROM projects`
	args := []interface{}{}
	if r.URL.Query().Get("featured") == "true" {
		query += ` WHERE featured = true`
	}
	query += ` ORDER BY sort_order ASC, start_date DESC`

	rows, err := s.db.Query(r.Context(), query, args...)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list projects")
		return
	}
	defer rows.Close()

	list := []models.Project{}
	for rows.Next() {
		p, err := scanProject(rows)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to scan project")
			return
		}
		list = append(list, p)
	}
	writeJSON(w, http.StatusOK, list)
}

func (s *Server) handleGetProject(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	row := s.db.QueryRow(r.Context(), `SELECT `+projectColumns+` FROM projects WHERE id = $1`, id)
	p, err := scanProject(row)
	if err != nil {
		writeError(w, http.StatusNotFound, "project not found")
		return
	}
	writeJSON(w, http.StatusOK, p)
}

type projectRequest struct {
	ID              string   `json:"id"`
	Title           string   `json:"title"`
	Description     string   `json:"description"`
	LongDescription *string  `json:"longDescription"`
	Technologies    []string `json:"technologies"`
	GithubURL       *string  `json:"githubUrl"`
	LiveURL         *string  `json:"liveUrl"`
	PaperURL        *string  `json:"paperUrl"`
	ImageURL        *string  `json:"imageUrl"`
	Featured        bool     `json:"featured"`
	Category        string   `json:"category"`
	StartDate       string   `json:"startDate"`
	EndDate         *string  `json:"endDate"`
	Status          *string  `json:"status"`
	Impact          *string  `json:"impact"`
	Metrics         []string `json:"metrics"`
	SortOrder       int      `json:"sortOrder"`
}

func (s *Server) handleCreateProject(w http.ResponseWriter, r *http.Request) {
	var req projectRequest
	if err := decodeJSON(r, &req); err != nil || req.ID == "" || req.Title == "" {
		writeError(w, http.StatusBadRequest, "id and title are required")
		return
	}
	s.upsertProject(w, r, req, "")
}

func (s *Server) handleUpdateProject(w http.ResponseWriter, r *http.Request) {
	var req projectRequest
	if err := decodeJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	id := chi.URLParam(r, "id")
	req.ID = id

	var oldImage *string
	_ = s.db.QueryRow(r.Context(), `SELECT image_url FROM projects WHERE id = $1`, id).Scan(&oldImage)

	s.upsertProject(w, r, req, deref(oldImage))
}

func (s *Server) upsertProject(w http.ResponseWriter, r *http.Request, req projectRequest, oldImageURL string) {
	if oldImageURL != "" {
		go s.storage.DeleteIfChanged(context.Background(), oldImageURL, deref(req.ImageURL))
	}

	_, err := s.db.Exec(r.Context(), `
		INSERT INTO projects (id, title, description, long_description, technologies, github_url,
			live_url, paper_url, image_url, featured, category, start_date, end_date, status,
			impact, metrics, sort_order, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, now())
		ON CONFLICT (id) DO UPDATE SET
			title = EXCLUDED.title, description = EXCLUDED.description,
			long_description = EXCLUDED.long_description, technologies = EXCLUDED.technologies,
			github_url = EXCLUDED.github_url, live_url = EXCLUDED.live_url, paper_url = EXCLUDED.paper_url,
			image_url = EXCLUDED.image_url, featured = EXCLUDED.featured, category = EXCLUDED.category,
			start_date = EXCLUDED.start_date, end_date = EXCLUDED.end_date, status = EXCLUDED.status,
			impact = EXCLUDED.impact, metrics = EXCLUDED.metrics, sort_order = EXCLUDED.sort_order,
			updated_at = now()`,
		req.ID, req.Title, req.Description, req.LongDescription, orEmptySlice(req.Technologies),
		req.GithubURL, req.LiveURL, req.PaperURL, req.ImageURL, req.Featured, req.Category,
		req.StartDate, req.EndDate, req.Status, req.Impact, orEmptySlice(req.Metrics), req.SortOrder)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to save project")
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{"id": req.ID})
}

func (s *Server) handleDeleteProject(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	ctx := r.Context()

	var imageURL *string
	_ = s.db.QueryRow(ctx, `SELECT image_url FROM projects WHERE id = $1`, id).Scan(&imageURL)

	if _, err := s.db.Exec(ctx, `DELETE FROM projects WHERE id = $1`, id); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to delete project")
		return
	}
	if imageURL != nil {
		go s.storage.Delete(context.Background(), *imageURL)
	}

	w.WriteHeader(http.StatusNoContent)
}
