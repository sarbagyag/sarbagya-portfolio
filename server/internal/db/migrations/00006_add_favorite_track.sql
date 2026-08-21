-- Adds a "favorite track" spot to the homepage Hero, editable via
-- /admin/profile: a Spotify track URL (rendered as Spotify's own compact
-- embed player) plus an optional short label above it (e.g. "On repeat").
-- Both nullable — the widget just doesn't render until a URL is set.
--
-- (Superseded by 00007, which replaces the Spotify-embed approach with a
-- self-hosted clip — restored to its originally-applied content here since
-- this migration had already run in production; see 00007 for the
-- follow-up. Do not edit an already-applied migration in place again.)
--
-- +goose Up
ALTER TABLE profile ADD COLUMN favorite_track_url text;
ALTER TABLE profile ADD COLUMN favorite_track_label text;

-- +goose Down
ALTER TABLE profile DROP COLUMN favorite_track_url;
ALTER TABLE profile DROP COLUMN favorite_track_label;
