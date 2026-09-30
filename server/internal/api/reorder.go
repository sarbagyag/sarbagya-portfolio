package api

import "net/http"

type reorderRequest struct {
	IDs []string `json:"ids"`
}

// reorderTable persists a new drag-and-drop order for a table: sort_order is
// assigned from each id's position in the given slice. `table` is always a
// hardcoded literal from one of the wrappers below, never request input.
func (s *Server) reorderTable(w http.ResponseWriter, r *http.Request, table string) {
	var req reorderRequest
	if err := decodeJSON(r, &req); err != nil || len(req.IDs) == 0 {
		writeError(w, http.StatusBadRequest, "ids are required")
		return
	}

	ctx := r.Context()
	tx, err := s.db.Begin(ctx)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to start transaction")
		return
	}
	defer tx.Rollback(ctx)

	query := `UPDATE ` + table + ` SET sort_order = $1 WHERE id = $2`
	for i, id := range req.IDs {
		if _, err := tx.Exec(ctx, query, i, id); err != nil {
			writeError(w, http.StatusInternalServerError, "failed to reorder")
			return
		}
	}

	if err := tx.Commit(ctx); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to commit")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (s *Server) handleReorderExperience(w http.ResponseWriter, r *http.Request) {
	s.reorderTable(w, r, "experience")
}

func (s *Server) handleReorderProjects(w http.ResponseWriter, r *http.Request) {
	s.reorderTable(w, r, "projects")
}

func (s *Server) handleReorderEducation(w http.ResponseWriter, r *http.Request) {
	s.reorderTable(w, r, "education")
}

func (s *Server) handleReorderSkills(w http.ResponseWriter, r *http.Request) {
	s.reorderTable(w, r, "skills")
}

func (s *Server) handleReorderShowcase(w http.ResponseWriter, r *http.Request) {
	s.reorderTable(w, r, "showcase_categories")
}

func (s *Server) handleReorderPosts(w http.ResponseWriter, r *http.Request) {
	s.reorderTable(w, r, "posts")
}
