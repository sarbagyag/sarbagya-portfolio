-- Adds a "favorite track" spot to the homepage Hero, editable via
-- /admin/profile: a Spotify track URL (rendered as Spotify's own compact
-- embed player, so playback needs no API keys or audio hosting) plus an
-- optional short label above it (e.g. "On repeat", "Currently vibing to").
-- Both nullable — the widget just doesn't render until a URL is set.
--
-- +goose Up
ALTER TABLE profile ADD COLUMN favorite_track_url text;
ALTER TABLE profile ADD COLUMN favorite_track_label text;

-- +goose Down
ALTER TABLE profile DROP COLUMN favorite_track_url;
ALTER TABLE profile DROP COLUMN favorite_track_label;
