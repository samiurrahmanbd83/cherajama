-- 010_reviews_unique.sql
-- Enforce one review per user per product

ALTER TABLE reviews
  ADD CONSTRAINT reviews_user_product_unique UNIQUE (product_id, user_id);

CREATE INDEX IF NOT EXISTS idx_reviews_user_product ON reviews(user_id, product_id);
