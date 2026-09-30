-- Adds drag-and-drop ordering to posts, same as experience/projects/education/
-- skills/showcase. Seeded from the existing admin ordering (newest created
-- first) so adding the column doesn't visibly reshuffle the list.
--
-- +goose Up
ALTER TABLE posts ADD COLUMN sort_order integer NOT NULL DEFAULT 0;

WITH ordered AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) - 1 AS rn
    FROM posts
)
UPDATE posts SET sort_order = ordered.rn
FROM ordered WHERE posts.id = ordered.id;

-- +goose Down
ALTER TABLE posts DROP COLUMN sort_order;
