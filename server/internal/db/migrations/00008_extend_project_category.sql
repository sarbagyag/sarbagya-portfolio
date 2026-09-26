-- Adds 5 new project_category values to support a wider range of project
-- types (AI/ML work, embedded firmware, language/interpreter projects,
-- hardware builds, and web apps) beyond the original ml/systems/networks
-- taxonomy. Kept in its own migration, separate from the seed data in
-- 00009, because Postgres forbids using a newly added enum value in the
-- same transaction that added it.
--
-- +goose Up
ALTER TYPE project_category ADD VALUE IF NOT EXISTS 'ai';
ALTER TYPE project_category ADD VALUE IF NOT EXISTS 'embedded';
ALTER TYPE project_category ADD VALUE IF NOT EXISTS 'languages';
ALTER TYPE project_category ADD VALUE IF NOT EXISTS 'hardware';
ALTER TYPE project_category ADD VALUE IF NOT EXISTS 'web';

-- +goose Down
-- Postgres has no ALTER TYPE ... DROP VALUE, so shrinking the enum means
-- recreating it. This assumes 00009's Down has already run and removed
-- every row using the new values — otherwise the USING cast below fails.
ALTER TYPE project_category RENAME TO project_category_old;
CREATE TYPE project_category AS ENUM ('ml', 'systems', 'networks');
ALTER TABLE projects ALTER COLUMN category TYPE project_category USING category::text::project_category;
DROP TYPE project_category_old;
