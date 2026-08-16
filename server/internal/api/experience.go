package api

import (
	"context"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5"

	"portfolio-api/internal/models"
)

func (s *Server) handleListExperience(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	rows, err := s.db.Query(ctx, `
		SELECT id, title, company, location, type, start_date, end_date, description,
		       responsibilities, technologies, achievements, company_url, sort_order,
		       created_at, updated_at
		FROM experience ORDER BY sort_order ASC, start_date DESC`)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list experience")
		return
	}
	defer rows.Close()

	list := []models.Experience{}
	for rows.Next() {
		var e models.Experience
		if err := rows.Scan(&e.ID, &e.Title, &e.Company, &e.Location, &e.Type, &e.StartDate,
			&e.EndDate, &e.Description, &e.Responsibilities, &e.Technologies, &e.Achievements,
			&e.CompanyURL, &e.SortOrder, &e.CreatedAt, &e.UpdatedAt); err != nil {
			writeError(w, http.StatusInternalServerError, "failed to scan experience")
			return
		}
		e.SubRoles = []models.ExperienceSubRole{}
		list = append(list, e)
	}

	subRoles, err := loadAllSubRoles(ctx, s.db)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to load sub-roles")
		return
	}
	for i := range list {
		list[i].SubRoles = subRoles[list[i].ID]
	}

	writeJSON(w, http.StatusOK, list)
}

func loadAllSubRoles(ctx context.Context, db dbQuerier) (map[string][]models.ExperienceSubRole, error) {
	rows, err := db.Query(ctx, `
		SELECT id, experience_id, title, company, start_date, end_date, description,
		       responsibilities, technologies, achievements, sort_order
		FROM experience_sub_roles ORDER BY sort_order ASC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	byExperience := map[string][]models.ExperienceSubRole{}
	for rows.Next() {
		var sr models.ExperienceSubRole
		if err := rows.Scan(&sr.ID, &sr.ExperienceID, &sr.Title, &sr.Company, &sr.StartDate,
			&sr.EndDate, &sr.Description, &sr.Responsibilities, &sr.Technologies,
			&sr.Achievements, &sr.SortOrder); err != nil {
			return nil, err
		}
		byExperience[sr.ExperienceID] = append(byExperience[sr.ExperienceID], sr)
	}
	return byExperience, nil
}

type experienceRequest struct {
	ID               string                     `json:"id"`
	Title            string                     `json:"title"`
	Company          string                     `json:"company"`
	Location         *string                    `json:"location"`
	Type             string                     `json:"type"`
	StartDate        string                     `json:"startDate"`
	EndDate          *string                    `json:"endDate"`
	Description      string                     `json:"description"`
	Responsibilities []string                   `json:"responsibilities"`
	Technologies     []string                   `json:"technologies"`
	Achievements     []string                   `json:"achievements"`
	CompanyURL       *string                    `json:"companyUrl"`
	SortOrder        int                        `json:"sortOrder"`
	SubRoles         []experienceSubRoleRequest `json:"subRoles"`
}

type experienceSubRoleRequest struct {
	Title            string   `json:"title"`
	Company          string   `json:"company"`
	StartDate        string   `json:"startDate"`
	EndDate          *string  `json:"endDate"`
	Description      string   `json:"description"`
	Responsibilities []string `json:"responsibilities"`
	Technologies     []string `json:"technologies"`
	Achievements     []string `json:"achievements"`
	SortOrder        int      `json:"sortOrder"`
}

func (s *Server) handleCreateExperience(w http.ResponseWriter, r *http.Request) {
	var req experienceRequest
	if err := decodeJSON(r, &req); err != nil || req.ID == "" || req.Title == "" || req.Company == "" {
		writeError(w, http.StatusBadRequest, "id, title, and company are required")
		return
	}
	s.upsertExperience(w, r, req)
}

func (s *Server) handleUpdateExperience(w http.ResponseWriter, r *http.Request) {
	var req experienceRequest
	if err := decodeJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	req.ID = chi.URLParam(r, "id") // id is locked on edit, matches the old form behavior
	s.upsertExperience(w, r, req)
}

func (s *Server) upsertExperience(w http.ResponseWriter, r *http.Request, req experienceRequest) {
	ctx := r.Context()
	tx, err := s.db.Begin(ctx)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to start transaction")
		return
	}
	defer tx.Rollback(ctx)

	_, err = tx.Exec(ctx, `
		INSERT INTO experience (id, title, company, location, type, start_date, end_date,
			description, responsibilities, technologies, achievements, company_url, sort_order, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, now())
		ON CONFLICT (id) DO UPDATE SET
			title = EXCLUDED.title, company = EXCLUDED.company, location = EXCLUDED.location,
			type = EXCLUDED.type, start_date = EXCLUDED.start_date, end_date = EXCLUDED.end_date,
			description = EXCLUDED.description, responsibilities = EXCLUDED.responsibilities,
			technologies = EXCLUDED.technologies, achievements = EXCLUDED.achievements,
			company_url = EXCLUDED.company_url, sort_order = EXCLUDED.sort_order, updated_at = now()`,
		req.ID, req.Title, req.Company, req.Location, req.Type, req.StartDate, req.EndDate,
		req.Description, orEmptySlice(req.Responsibilities), orEmptySlice(req.Technologies),
		orEmptySlice(req.Achievements), req.CompanyURL, req.SortOrder)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to save experience")
		return
	}

	// Sub-roles are fully replaced on every save — simplest correct approach
	// for a small, admin-edited list (mirrors how the old client-managed
	// dynamic array form worked).
	if _, err := tx.Exec(ctx, `DELETE FROM experience_sub_roles WHERE experience_id = $1`, req.ID); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to clear sub-roles")
		return
	}
	for _, sr := range req.SubRoles {
		_, err := tx.Exec(ctx, `
			INSERT INTO experience_sub_roles (experience_id, title, company, start_date, end_date,
				description, responsibilities, technologies, achievements, sort_order)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
			req.ID, sr.Title, sr.Company, sr.StartDate, sr.EndDate, sr.Description,
			orEmptySlice(sr.Responsibilities), orEmptySlice(sr.Technologies), orEmptySlice(sr.Achievements), sr.SortOrder)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to save sub-role")
			return
		}
	}

	if err := tx.Commit(ctx); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to commit")
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{"id": req.ID})
}

func (s *Server) handleDeleteExperience(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	_, err := s.db.Exec(r.Context(), `DELETE FROM experience WHERE id = $1`, id) // sub-roles cascade
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to delete experience")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// dbQuerier is satisfied by both *pgxpool.Pool and pgx.Tx, so helpers like
// loadAllSubRoles work in either a plain query or inside a transaction.
type dbQuerier interface {
	Query(ctx context.Context, sql string, args ...interface{}) (pgx.Rows, error)
}
