-- The nav logo mark ("sgs.") was hardcoded straight into
-- components/Layout/Navigation.tsx — the one piece of site branding that
-- wasn't editable via /admin, which matters now that this same codebase
-- gets deployed for other people (e.g. Aditya Timalsina's site wants "AT"
-- instead). Adds a profile column for it and backfills the existing row
-- with the current hardcoded text, so the site looks unchanged until
-- edited via /admin.
--
-- +goose Up
ALTER TABLE profile ADD COLUMN logo_initials text NOT NULL DEFAULT 'sgs';

UPDATE profile SET logo_initials = 'sgs' WHERE id = 1;

-- +goose Down
ALTER TABLE profile DROP COLUMN logo_initials;
