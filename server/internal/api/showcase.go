package api

import (
	"context"
	"net/http"

	"github.com/go-chi/chi/v5"

	"portfolio-api/internal/models"
)

func (s *Server) handleListShowcase(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	rows, err := s.db.Query(ctx, `
		SELECT id, title, description, featured_name, featured_url, featured_image_url,
		       sort_order, created_at, updated_at
		FROM showcase_categories ORDER BY sort_order ASC, title ASC`)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list showcase categories")
		return
	}
	defer rows.Close()

	list := []models.ShowcaseCategory{}
	for rows.Next() {
		var c models.ShowcaseCategory
		if err := rows.Scan(&c.ID, &c.Title, &c.Description, &c.FeaturedName, &c.FeaturedURL,
			&c.FeaturedImageURL, &c.SortOrder, &c.CreatedAt, &c.UpdatedAt); err != nil {
			writeError(w, http.StatusInternalServerError, "failed to scan showcase category")
			return
		}
		c.Items = []models.ShowcaseItem{}
		list = append(list, c)
	}

	items, err := loadAllShowcaseItems(ctx, s.db)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to load showcase items")
		return
	}
	for i := range list {
		// A missing map key returns a nil slice, which encodes as JSON
		// `null` — leave the []ShowcaseItem{} default from above alone
		// unless there's actually a non-nil match to overwrite it with.
		if v, ok := items[list[i].ID]; ok {
			list[i].Items = v
		}
	}

	writeJSON(w, http.StatusOK, list)
}

func loadAllShowcaseItems(ctx context.Context, db dbQuerier) (map[string][]models.ShowcaseItem, error) {
	rows, err := db.Query(ctx, `
		SELECT id, category_id, name, url, sort_order
		FROM showcase_items ORDER BY sort_order ASC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	byCategory := map[string][]models.ShowcaseItem{}
	for rows.Next() {
		var it models.ShowcaseItem
		if err := rows.Scan(&it.ID, &it.CategoryID, &it.Name, &it.URL, &it.SortOrder); err != nil {
			return nil, err
		}
		byCategory[it.CategoryID] = append(byCategory[it.CategoryID], it)
	}
	return byCategory, nil
}

type showcaseItemRequest struct {
	Name      string `json:"name"`
	URL       string `json:"url"`
	SortOrder int    `json:"sortOrder"`
}

type showcaseCategoryRequest struct {
	ID               string                `json:"id"`
	Title            string                `json:"title"`
	Description      string                `json:"description"`
	FeaturedName     string                `json:"featuredName"`
	FeaturedURL      string                `json:"featuredUrl"`
	FeaturedImageURL *string               `json:"featuredImageUrl"`
	SortOrder        int                   `json:"sortOrder"`
	Items            []showcaseItemRequest `json:"items"`
}

func (s *Server) handleCreateShowcase(w http.ResponseWriter, r *http.Request) {
	var req showcaseCategoryRequest
	if err := decodeJSON(r, &req); err != nil || req.ID == "" || req.Title == "" {
		writeError(w, http.StatusBadRequest, "id and title are required")
		return
	}
	s.upsertShowcaseCategory(w, r, req, "")
}

func (s *Server) handleUpdateShowcase(w http.ResponseWriter, r *http.Request) {
	var req showcaseCategoryRequest
	if err := decodeJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	id := chi.URLParam(r, "id")
	req.ID = id

	var oldImage *string
	_ = s.db.QueryRow(r.Context(), `SELECT featured_image_url FROM showcase_categories WHERE id = $1`, id).Scan(&oldImage)

	s.upsertShowcaseCategory(w, r, req, deref(oldImage))
}

func (s *Server) upsertShowcaseCategory(w http.ResponseWriter, r *http.Request, req showcaseCategoryRequest, oldImageURL string) {
	ctx := r.Context()

	if oldImageURL != "" {
		go s.storage.DeleteIfChanged(context.Background(), oldImageURL, deref(req.FeaturedImageURL))
	}

	tx, err := s.db.Begin(ctx)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to start transaction")
		return
	}
	defer tx.Rollback(ctx)

	_, err = tx.Exec(ctx, `
		INSERT INTO showcase_categories (id, title, description, featured_name, featured_url,
			featured_image_url, sort_order, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, now())
		ON CONFLICT (id) DO UPDATE SET
			title = EXCLUDED.title, description = EXCLUDED.description,
			featured_name = EXCLUDED.featured_name, featured_url = EXCLUDED.featured_url,
			featured_image_url = EXCLUDED.featured_image_url, sort_order = EXCLUDED.sort_order,
			updated_at = now()`,
		req.ID, req.Title, req.Description, req.FeaturedName, req.FeaturedURL,
		req.FeaturedImageURL, req.SortOrder)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to save showcase category")
		return
	}

	// Items are fully replaced on every save — same approach as
	// experience_sub_roles, simplest correct thing for a small admin-edited list.
	if _, err := tx.Exec(ctx, `DELETE FROM showcase_items WHERE category_id = $1`, req.ID); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to clear showcase items")
		return
	}
	for _, it := range req.Items {
		_, err := tx.Exec(ctx, `
			INSERT INTO showcase_items (category_id, name, url, sort_order)
			VALUES ($1, $2, $3, $4)`,
			req.ID, it.Name, it.URL, it.SortOrder)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to save showcase item")
			return
		}
	}

	if err := tx.Commit(ctx); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to commit")
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{"id": req.ID})
}

func (s *Server) handleDeleteShowcase(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	ctx := r.Context()

	var imageURL *string
	_ = s.db.QueryRow(ctx, `SELECT featured_image_url FROM showcase_categories WHERE id = $1`, id).Scan(&imageURL)

	if _, err := s.db.Exec(ctx, `DELETE FROM showcase_categories WHERE id = $1`, id); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to delete showcase category")
		return
	}
	if imageURL != nil {
		go s.storage.Delete(context.Background(), *imageURL)
	}

	w.WriteHeader(http.StatusNoContent)
}
