package api

import (
	"net/http"

	"github.com/go-chi/chi/v5"

	"portfolio-api/internal/models"
)

func (s *Server) handleListEducation(w http.ResponseWriter, r *http.Request) {
	rows, err := s.db.Query(r.Context(), `
		SELECT id, institution, degree, field, start_date, end_date, gpa, location,
		       description, achievements, relevant_coursework, thesis, sort_order
		FROM education ORDER BY sort_order ASC, start_date DESC`)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list education")
		return
	}
	defer rows.Close()

	list := []models.Education{}
	for rows.Next() {
		var e models.Education
		if err := rows.Scan(&e.ID, &e.Institution, &e.Degree, &e.Field, &e.StartDate, &e.EndDate,
			&e.GPA, &e.Location, &e.Description, &e.Achievements, &e.RelevantCoursework,
			&e.Thesis, &e.SortOrder); err != nil {
			writeError(w, http.StatusInternalServerError, "failed to scan education")
			return
		}
		list = append(list, e)
	}
	writeJSON(w, http.StatusOK, list)
}

type educationRequest struct {
	ID                 string   `json:"id"`
	Institution        string   `json:"institution"`
	Degree             string   `json:"degree"`
	Field              string   `json:"field"`
	StartDate          string   `json:"startDate"`
	EndDate            *string  `json:"endDate"`
	GPA                *string  `json:"gpa"`
	Location           *string  `json:"location"`
	Description        *string  `json:"description"`
	Achievements       []string `json:"achievements"`
	RelevantCoursework []string `json:"relevantCoursework"`
	Thesis             *string  `json:"thesis"`
	SortOrder          int      `json:"sortOrder"`
}

func (s *Server) handleCreateEducation(w http.ResponseWriter, r *http.Request) {
	var req educationRequest
	if err := decodeJSON(r, &req); err != nil || req.ID == "" || req.Institution == "" {
		writeError(w, http.StatusBadRequest, "id and institution are required")
		return
	}
	s.upsertEducation(w, r, req)
}

func (s *Server) handleUpdateEducation(w http.ResponseWriter, r *http.Request) {
	var req educationRequest
	if err := decodeJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	req.ID = chi.URLParam(r, "id")
	s.upsertEducation(w, r, req)
}

func (s *Server) upsertEducation(w http.ResponseWriter, r *http.Request, req educationRequest) {
	_, err := s.db.Exec(r.Context(), `
		INSERT INTO education (id, institution, degree, field, start_date, end_date, gpa,
			location, description, achievements, relevant_coursework, thesis, sort_order)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
		ON CONFLICT (id) DO UPDATE SET
			institution = EXCLUDED.institution, degree = EXCLUDED.degree, field = EXCLUDED.field,
			start_date = EXCLUDED.start_date, end_date = EXCLUDED.end_date, gpa = EXCLUDED.gpa,
			location = EXCLUDED.location, description = EXCLUDED.description,
			achievements = EXCLUDED.achievements, relevant_coursework = EXCLUDED.relevant_coursework,
			thesis = EXCLUDED.thesis, sort_order = EXCLUDED.sort_order`,
		req.ID, req.Institution, req.Degree, req.Field, req.StartDate, req.EndDate, req.GPA,
		req.Location, req.Description, orEmptySlice(req.Achievements), orEmptySlice(req.RelevantCoursework),
		req.Thesis, req.SortOrder)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to save education")
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"id": req.ID})
}

func (s *Server) handleDeleteEducation(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if _, err := s.db.Exec(r.Context(), `DELETE FROM education WHERE id = $1`, id); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to delete education")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
