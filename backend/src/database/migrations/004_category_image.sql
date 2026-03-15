-- 004_category_image.sql
-- Add image_url to categories for uploaded images

ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS image_url TEXT;
