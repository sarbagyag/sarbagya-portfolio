package api

import (
	"context"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"

	"portfolio-api/internal/models"
)

const postColumns = `id, type, slug, title, excerpt, content_markdown, cover_image_url,
	tags, status, published_at, created_at, updated_at`

func scanPost(row interface{ Scan(...interface{}) error }) (models.Post, error) {
	var p models.Post
	err := row.Scan(&p.ID, &p.Type, &p.Slug, &p.Title, &p.Excerpt, &p.ContentMarkdown,
		&p.CoverImageURL, &p.Tags, &p.Status, &p.PublishedAt, &p.CreatedAt, &p.UpdatedAt)
	return p, err
}

// handlePublicListPosts only ever returns published posts — draft posts
// stay invisible outside the admin dashboard. ?type=blog|learning-log
func (s *Server) handlePublicListPosts(w http.ResponseWriter, r *http.Request) {
	postType := r.URL.Query().Get("type")
	query := `SELECT ` + postColumns + ` FROM posts WHERE status = 'published'`
	args := []interface{}{}
	if postType != "" {
		query += ` AND type = $1`
		args = append(args, postType)
	}
	query += ` ORDER BY published_at DESC`

	s.listPosts(w, r, query, args)
}

func (s *Server) handleAdminListPosts(w http.ResponseWriter, r *http.Request) {
	postType := r.URL.Query().Get("type")
	query := `SELECT ` + postColumns + ` FROM posts`
	args := []interface{}{}
	if postType != "" {
		query += ` WHERE type = $1`
		args = append(args, postType)
	}
	query += ` ORDER BY created_at DESC`

	s.listPosts(w, r, query, args)
}

func (s *Server) listPosts(w http.ResponseWriter, r *http.Request, query string, args []interface{}) {
	rows, err := s.db.Query(r.Context(), query, args...)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list posts")
		return
	}
	defer rows.Close()

	list := []models.Post{}
	for rows.Next() {
		p, err := scanPost(rows)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to scan post")
			return
		}
		list = append(list, p)
	}
	writeJSON(w, http.StatusOK, list)
}

func (s *Server) handleGetPostBySlug(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	row := s.db.QueryRow(r.Context(),
		`SELECT `+postColumns+` FROM posts WHERE slug = $1 AND status = 'published'`, slug)
	p, err := scanPost(row)
	if err != nil {
		writeError(w, http.StatusNotFound, "post not found")
		return
	}
	writeJSON(w, http.StatusOK, p)
}

type postRequest struct {
	Type            string   `json:"type"`
	Slug            string   `json:"slug"`
	Title           string   `json:"title"`
	Excerpt         *string  `json:"excerpt"`
	ContentMarkdown string   `json:"contentMarkdown"`
	CoverImageURL   *string  `json:"coverImageUrl"`
	Tags            []string `json:"tags"`
	Status          string   `json:"status"`
}

func (s *Server) handleCreatePost(w http.ResponseWriter, r *http.Request) {
	var req postRequest
	if err := decodeJSON(r, &req); err != nil || req.Slug == "" || req.Title == "" {
		writeError(w, http.StatusBadRequest, "slug and title are required")
		return
	}
	s.upsertPost(w, r, req, "", "")
}

func (s *Server) handleUpdatePost(w http.ResponseWriter, r *http.Request) {
	var req postRequest
	if err := decodeJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	id := chi.URLParam(r, "id")

	var oldCover *string
	_ = s.db.QueryRow(r.Context(), `SELECT cover_image_url FROM posts WHERE id = $1`, id).Scan(&oldCover)

	s.upsertPost(w, r, req, id, deref(oldCover))
}

func (s *Server) upsertPost(w http.ResponseWriter, r *http.Request, req postRequest, id, oldCoverURL string) {
	if oldCoverURL != "" {
		go s.storage.DeleteIfChanged(context.Background(), oldCoverURL, deref(req.CoverImageURL))
	}

	var publishedAt *time.Time
	if req.Status == "published" {
		now := time.Now()
		publishedAt = &now
	}

	postType := req.Type
	if postType == "" {
		postType = "blog"
	}
	status := req.Status
	if status == "" {
		status = "draft"
	}

	var returnedID string
	if id == "" {
		err := s.db.QueryRow(r.Context(), `
			INSERT INTO posts (type, slug, title, excerpt, content_markdown, cover_image_url,
				tags, status, published_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, now())
			RETURNING id`,
			postType, req.Slug, req.Title, req.Excerpt, req.ContentMarkdown, req.CoverImageURL,
			orEmptySlice(req.Tags), status, publishedAt,
		).Scan(&returnedID)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to create post — slug may already be taken")
			return
		}
	} else {
		// Preserve the original publishedAt once a post has ever been
		// published, instead of bumping it forward on every edit.
		_, err := s.db.Exec(r.Context(), `
			UPDATE posts SET type = $1, slug = $2, title = $3, excerpt = $4,
				content_markdown = $5, cover_image_url = $6, tags = $7, status = $8,
				published_at = COALESCE(published_at, $9), updated_at = now()
			WHERE id = $10`,
			postType, req.Slug, req.Title, req.Excerpt, req.ContentMarkdown, req.CoverImageURL,
			orEmptySlice(req.Tags), status, publishedAt, id)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to update post")
			return
		}
		returnedID = id
	}

	writeJSON(w, http.StatusOK, map[string]string{"id": returnedID})
}

func (s *Server) handleDeletePost(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	ctx := r.Context()

	var coverURL *string
	_ = s.db.QueryRow(ctx, `SELECT cover_image_url FROM posts WHERE id = $1`, id).Scan(&coverURL)

	if _, err := s.db.Exec(ctx, `DELETE FROM posts WHERE id = $1`, id); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to delete post")
		return
	}
	if coverURL != nil {
		go s.storage.Delete(context.Background(), *coverURL)
	}

	w.WriteHeader(http.StatusNoContent)
}
