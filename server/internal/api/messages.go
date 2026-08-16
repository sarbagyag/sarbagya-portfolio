package api

import (
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"

	"portfolio-api/internal/models"
)

type contactRequest struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Subject string `json:"subject"`
	Message string `json:"message"`
}

func (s *Server) handleSubmitContact(w http.ResponseWriter, r *http.Request) {
	var req contactRequest
	if err := decodeJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	req.Name = strings.TrimSpace(req.Name)
	req.Email = strings.TrimSpace(req.Email)
	req.Message = strings.TrimSpace(req.Message)
	if req.Name == "" || req.Email == "" || req.Message == "" {
		writeError(w, http.StatusBadRequest, "name, email, and message are required")
		return
	}

	_, err := s.db.Exec(r.Context(),
		`INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4)`,
		req.Name, req.Email, nullableString(req.Subject), req.Message)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to submit message")
		return
	}

	writeJSON(w, http.StatusCreated, map[string]bool{"success": true})
}

func nullableString(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}

func (s *Server) handleListMessages(w http.ResponseWriter, r *http.Request) {
	rows, err := s.db.Query(r.Context(), `
		SELECT id, name, email, subject, message, read, created_at
		FROM contact_messages ORDER BY created_at DESC`)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list messages")
		return
	}
	defer rows.Close()

	list := []models.ContactMessage{}
	for rows.Next() {
		var m models.ContactMessage
		if err := rows.Scan(&m.ID, &m.Name, &m.Email, &m.Subject, &m.Message, &m.Read, &m.CreatedAt); err != nil {
			writeError(w, http.StatusInternalServerError, "failed to scan message")
			return
		}
		list = append(list, m)
	}
	writeJSON(w, http.StatusOK, list)
}

func (s *Server) handleMarkMessageRead(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if _, err := s.db.Exec(r.Context(), `UPDATE contact_messages SET read = true WHERE id = $1`, id); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to mark message read")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (s *Server) handleDeleteMessage(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if _, err := s.db.Exec(r.Context(), `DELETE FROM contact_messages WHERE id = $1`, id); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to delete message")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
