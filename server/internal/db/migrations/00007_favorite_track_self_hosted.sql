-- Replaces the Spotify-embed favorite track (00006) with a self-hosted
-- clip: audio downloaded from a YouTube link + trimmed server-side via
-- yt-dlp/ffmpeg, then re-uploaded to our own MinIO bucket (see
-- internal/media and handleProcessFavoriteTrack). favorite_track_url
-- (a Spotify link) is no longer used by anything and is dropped;
-- favorite_track_label (the small caption above the player) is unchanged
-- and carries over as-is.
--
-- +goose Up
ALTER TABLE profile DROP COLUMN favorite_track_url;
ALTER TABLE profile ADD COLUMN favorite_track_audio_url text;
ALTER TABLE profile ADD COLUMN favorite_track_cover_url text;
ALTER TABLE profile ADD COLUMN favorite_track_title text;
ALTER TABLE profile ADD COLUMN favorite_track_artist text;
ALTER TABLE profile ADD COLUMN favorite_track_source_url text;

-- +goose Down
ALTER TABLE profile DROP COLUMN favorite_track_audio_url;
ALTER TABLE profile DROP COLUMN favorite_track_cover_url;
ALTER TABLE profile DROP COLUMN favorite_track_title;
ALTER TABLE profile DROP COLUMN favorite_track_artist;
ALTER TABLE profile DROP COLUMN favorite_track_source_url;
ALTER TABLE profile ADD COLUMN favorite_track_url text;
