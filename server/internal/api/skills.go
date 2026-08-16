package api

import (
	"net/http"

	"github.com/go-chi/chi/v5"

	"portfolio-api/internal/models"
)

func (s *Server) handleListSkills(w http.ResponseWriter, r *http.Request) {
	rows, err := s.db.Query(r.Context(), `
		SELECT id, category, skills, proficiency, sort_order
		FROM skills ORDER BY sort_order ASC, category ASC`)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list skills")
		return
	}
	defer rows.Close()

	list := []models.Skill{}
	for rows.Next() {
		var sk models.Skill
		if err := rows.Scan(&sk.ID, &sk.Category, &sk.Skills, &sk.Proficiency, &sk.SortOrder); err != nil {
			writeError(w, http.StatusInternalServerError, "failed to scan skill")
			return
		}
		list = append(list, sk)
	}
	writeJSON(w, http.StatusOK, list)
}

type skillRequest struct {
	Category    string   `json:"category"`
	Skills      []string `json:"skills"`
	Proficiency *string  `json:"proficiency"`
	SortOrder   int      `json:"sortOrder"`
}

func (s *Server) handleCreateSkill(w http.ResponseWriter, r *http.Request) {
	var req skillRequest
	if err := decodeJSON(r, &req); err != nil || req.Category == "" {
		writeError(w, http.StatusBadRequest, "category is required")
		return
	}

	var id string
	err := s.db.QueryRow(r.Context(), `
		INSERT INTO skills (category, skills, proficiency, sort_order)
		VALUES ($1, $2, $3, $4) RETURNING id`,
		req.Category, orEmptySlice(req.Skills), req.Proficiency, req.SortOrder,
	).Scan(&id)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to create skill")
		return
	}
	writeJSON(w, http.StatusCreated, map[string]string{"id": id})
}

func (s *Server) handleUpdateSkill(w http.ResponseWriter, r *http.Request) {
	var req skillRequest
	if err := decodeJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	id := chi.URLParam(r, "id")

	_, err := s.db.Exec(r.Context(), `
		UPDATE skills SET category = $1, skills = $2, proficiency = $3, sort_order = $4
		WHERE id = $5`,
		req.Category, orEmptySlice(req.Skills), req.Proficiency, req.SortOrder, id)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to update skill")
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"id": id})
}

func (s *Server) handleDeleteSkill(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if _, err := s.db.Exec(r.Context(), `DELETE FROM skills WHERE id = $1`, id); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to delete skill")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
