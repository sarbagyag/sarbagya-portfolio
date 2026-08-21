package api

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"regexp"

	"portfolio-api/internal/media"
)

var youtubeURLPattern = regexp.MustCompile(`^https?://(www\.)?(youtube\.com/(watch\?v=|shorts/)|youtu\.be/)[\w-]+`)

type processFavoriteTrackRequest struct {
	YoutubeURL string `json:"youtubeUrl"`
	StartSec   int    `json:"startSec"`
	EndSec     int    `json:"endSec"`
}

type processFavoriteTrackResponse struct {
	AudioURL string `json:"audioUrl"`
	CoverURL string `json:"coverUrl,omitempty"`
}

// handleProcessFavoriteTrack downloads a YouTube video's audio via yt-dlp,
// trims the requested window with ffmpeg, and re-hosts both the clip and
// (best-effort) its thumbnail in our own storage — nothing here is served
// from YouTube/Spotify/etc. at request time on the public site. This is the
// slow step (network fetch + transcode); it's registered with a longer
// timeout than the rest of the admin API (see router.go). The resulting
// URLs get submitted through the normal profile save afterward, same as
// the avatar/resume upload fields.
func (s *Server) handleProcessFavoriteTrack(w http.ResponseWriter, r *http.Request) {
	var req processFavoriteTrackRequest
	if err := decodeJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if !youtubeURLPattern.MatchString(req.YoutubeURL) {
		writeError(w, http.StatusBadRequest, "must be a youtube.com or youtu.be video link")
		return
	}
	if req.StartSec < 0 || req.EndSec <= req.StartSec {
		writeError(w, http.StatusBadRequest, "end must be after start")
		return
	}
	if req.EndSec-req.StartSec > media.MaxClipSeconds {
		writeError(w, http.StatusBadRequest, fmt.Sprintf("clip can't be longer than %d seconds", media.MaxClipSeconds))
		return
	}

	clipPath, thumbPath, cleanup, err := media.ExtractClip(r.Context(), req.YoutubeURL, req.StartSec, req.EndSec, s.cfg.YtDlpCookiesPath)
	if err != nil {
		writeError(w, http.StatusBadGateway, err.Error())
		return
	}
	defer cleanup()

	audioURL, err := s.uploadLocalFile(r.Context(), clipPath, "audio/mpeg")
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to store audio clip")
		return
	}

	resp := processFavoriteTrackResponse{AudioURL: audioURL}
	if thumbPath != "" {
		// A failed thumbnail upload isn't fatal — the track audio above is
		// already saved, so we just ship without cover art.
		if coverURL, thumbErr := s.uploadLocalFile(r.Context(), thumbPath, "image/jpeg"); thumbErr == nil {
			resp.CoverURL = coverURL
		}
	}

	writeJSON(w, http.StatusOK, resp)
}

func (s *Server) uploadLocalFile(ctx context.Context, path, contentType string) (string, error) {
	f, err := os.Open(path)
	if err != nil {
		return "", err
	}
	defer f.Close()

	info, err := f.Stat()
	if err != nil {
		return "", err
	}

	return s.storage.UploadBytes(ctx, f, info.Size(), contentType, filepath.Ext(path))
}
