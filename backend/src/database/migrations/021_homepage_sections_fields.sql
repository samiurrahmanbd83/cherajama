-- 021_homepage_sections_fields.sql
-- Add simple CMS fields to homepage sections

ALTER TABLE homepage_sections
  ADD COLUMN IF NOT EXISTS content TEXT,
  ADD COLUMN IF NOT EXISTS image TEXT,
  ADD COLUMN IF NOT EXISTS position INTEGER;

UPDATE homepage_sections
SET position = sort_order
WHERE position IS NULL;
