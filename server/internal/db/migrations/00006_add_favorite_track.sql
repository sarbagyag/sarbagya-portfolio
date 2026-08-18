-- Adds a "favorite track" spot to the homepage Hero, editable via
-- /admin/profile: a self-hosted audio clip (downloaded from a YouTube link
-- + trimmed server-side via yt-dlp/ffmpeg, then re-uploaded to our own
-- MinIO bucket — see internal/media and handleProcessFavoriteTrack) with
-- a title/artist and an optional short label above it (e.g. "On repeat").
-- All nullable — the widget just doesn't render until it's set.
--
-- (This migration originally shipped as a single favorite_track_url column
-- pointing at a Spotify embed; that approach never went further than this
-- migration file, so it's being replaced in place rather than layered
-- with a follow-up migration.)
--
-- +goose Up
ALTER TABLE profile ADD COLUMN favorite_track_audio_url text;
ALTER TABLE profile ADD COLUMN favorite_track_cover_url text;
ALTER TABLE profile ADD COLUMN favorite_track_title text;
ALTER TABLE profile ADD COLUMN favorite_track_artist text;
ALTER TABLE profile ADD COLUMN favorite_track_source_url text;
ALTER TABLE profile ADD COLUMN favorite_track_label text;

-- +goose Down
ALTER TABLE profile DROP COLUMN favorite_track_audio_url;
ALTER TABLE profile DROP COLUMN favorite_track_cover_url;
ALTER TABLE profile DROP COLUMN favorite_track_title;
ALTER TABLE profile DROP COLUMN favorite_track_artist;
ALTER TABLE profile DROP COLUMN favorite_track_source_url;
ALTER TABLE profile DROP COLUMN favorite_track_label;
