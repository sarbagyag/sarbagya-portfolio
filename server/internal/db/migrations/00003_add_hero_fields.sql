-- Three pieces of the homepage Hero section were hardcoded in the
-- component instead of coming from `profile` (the role tagline line, the
-- italic motto, and the education highlight badge) — this adds columns for
-- them and backfills the existing profile row with the current hardcoded
-- text, so the homepage looks unchanged until edited via /admin.
--
-- +goose Up
ALTER TABLE profile ADD COLUMN hero_roles text[] NOT NULL DEFAULT '{}';
ALTER TABLE profile ADD COLUMN hero_motto text;
ALTER TABLE profile ADD COLUMN hero_badge text;

UPDATE profile SET
    hero_roles = '{"Full Stack","AI/ML","Embedded Systems","Edge AI","Music Producer"}',
    hero_motto = 'Building things that work and sounds that connect.',
    hero_badge = 'B.E. Electronics, Communication & Information • IOE, Pulchowk Campus • Class of 2025'
WHERE id = 1;

-- +goose Down
ALTER TABLE profile DROP COLUMN hero_roles;
ALTER TABLE profile DROP COLUMN hero_motto;
ALTER TABLE profile DROP COLUMN hero_badge;
