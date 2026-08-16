package api

import (
	"net/http"

	"portfolio-api/internal/storage"
)

func (s *Server) handleUpload(w http.ResponseWriter, r *http.Request) {
	// A bit of headroom over the 5MB file cap for multipart overhead.
	r.Body = http.MaxBytesReader(w, r.Body, storage.MaxUploadSize+1<<20)

	if err := r.ParseMultipartForm(storage.MaxUploadSize + 1<<20); err != nil {
		writeError(w, http.StatusBadRequest, "file too large or invalid form")
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		writeError(w, http.StatusBadRequest, "missing file field")
		return
	}
	defer file.Close()

	url, err := s.storage.Upload(r.Context(), file, header)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{"url": url})
}
