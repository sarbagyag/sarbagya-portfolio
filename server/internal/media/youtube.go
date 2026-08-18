// Package media shells out to yt-dlp and ffmpeg (both must be on PATH — see
// server/Dockerfile) to turn a YouTube link into a short, self-hosted audio
// clip: yt-dlp downloads+extracts the full track to mp3, ffmpeg cuts the
// requested window out of it. Nothing here talks to storage — callers
// upload the resulting files themselves and are responsible for calling
// the returned cleanup func once done reading them.
package media

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
)

// MaxClipSeconds bounds both the requested window and, implicitly, how
// long the ffmpeg trim step has to run — this is meant to stay a short
// preview, not a full-song mirror.
const MaxClipSeconds = 60

// ExtractClip downloads audio for youtubeURL via yt-dlp, grabs its
// thumbnail, and cuts [startSec, endSec) out of the audio with ffmpeg.
// Returns paths to the resulting clip + thumbnail (thumbPath is "" if no
// thumbnail could be fetched — that alone isn't fatal) inside a temp
// directory, plus a cleanup func the caller must defer-call once it's done
// reading them (normally: uploaded to storage).
func ExtractClip(ctx context.Context, youtubeURL string, startSec, endSec int) (clipPath, thumbPath string, cleanup func(), err error) {
	if endSec <= startSec {
		return "", "", nil, fmt.Errorf("end must be after start")
	}
	if endSec-startSec > MaxClipSeconds {
		return "", "", nil, fmt.Errorf("clip can't be longer than %d seconds", MaxClipSeconds)
	}

	tmpDir, err := os.MkdirTemp("", "favorite-track-*")
	if err != nil {
		return "", "", nil, fmt.Errorf("create temp dir: %w", err)
	}
	cleanup = func() { os.RemoveAll(tmpDir) }

	// yt-dlp does the download AND the extract-to-mp3 step itself (it
	// shells out to ffmpeg internally for that) — we only need our own
	// ffmpeg pass afterward to trim the window. Output is templated
	// (raw.%(ext)s) rather than asserted as raw.mp3 outright, since we
	// can't watch yt-dlp's exact post-processing naming from here —
	// falling back to a glob below if the plain name isn't there.
	dlOut := filepath.Join(tmpDir, "raw.%(ext)s")
	dl := exec.CommandContext(ctx, "yt-dlp",
		"-x", "--audio-format", "mp3", "--audio-quality", "5",
		"--no-playlist",
		"-o", dlOut,
		youtubeURL,
	)
	if out, dlErr := dl.CombinedOutput(); dlErr != nil {
		cleanup()
		return "", "", nil, fmt.Errorf("yt-dlp download failed: %s", tail(out))
	}

	rawAudio := filepath.Join(tmpDir, "raw.mp3")
	if _, statErr := os.Stat(rawAudio); statErr != nil {
		matches, _ := filepath.Glob(filepath.Join(tmpDir, "raw.*"))
		if len(matches) == 0 {
			cleanup()
			return "", "", nil, fmt.Errorf("yt-dlp produced no audio output")
		}
		rawAudio = matches[0]
	}

	// Best-effort — a missing thumbnail shouldn't fail the whole request,
	// the track audio above is already good.
	thumbOut := filepath.Join(tmpDir, "thumb.%(ext)s")
	th := exec.CommandContext(ctx, "yt-dlp",
		"--skip-download", "--write-thumbnail", "--convert-thumbnails", "jpg",
		"--no-playlist",
		"-o", thumbOut,
		youtubeURL,
	)
	_ = th.Run()
	if matches, _ := filepath.Glob(filepath.Join(tmpDir, "thumb.*")); len(matches) > 0 {
		thumbPath = matches[0]
	}

	clip := filepath.Join(tmpDir, "clip.mp3")
	trim := exec.CommandContext(ctx, "ffmpeg", "-y",
		"-i", rawAudio,
		"-ss", fmt.Sprintf("%d", startSec),
		"-to", fmt.Sprintf("%d", endSec),
		"-vn", "-acodec", "libmp3lame", "-b:a", "128k",
		clip,
	)
	if out, trimErr := trim.CombinedOutput(); trimErr != nil {
		cleanup()
		return "", "", nil, fmt.Errorf("ffmpeg trim failed: %s", tail(out))
	}

	return clip, thumbPath, cleanup, nil
}

// tail keeps just the end of a CLI tool's combined output — the useful
// error line is almost always the last one, and the full output can be
// long enough to be unpleasant to surface as an HTTP error message.
func tail(b []byte) string {
	const max = 500
	s := string(b)
	if len(s) > max {
		s = s[len(s)-max:]
	}
	return s
}
