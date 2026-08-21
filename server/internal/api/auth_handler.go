package api

import (
	"net/http"

	"portfolio-api/internal/auth"
)

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (s *Server) handleLogin(w http.ResponseWriter, r *http.Request) {
	var req loginRequest
	if err := decodeJSON(r, &req); err != nil || req.Email == "" || req.Password == "" {
		writeError(w, http.StatusBadRequest, "email and password are required")
		return
	}

	var id, passwordHash string
	err := s.db.QueryRow(r.Context(),
		`SELECT id, password_hash FROM admin_users WHERE email = $1`, req.Email,
	).Scan(&id, &passwordHash)
	if err != nil || !auth.CheckPassword(passwordHash, req.Password) {
		writeError(w, http.StatusUnauthorized, "invalid email or password")
		return
	}

	token, err := auth.IssueToken(s.cfg.JWTSecret, req.Email, id)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to issue token")
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{"token": token})
}
