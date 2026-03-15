-- 005_cart_user.sql
-- Ensure carts table supports user association (already in base schema, but safe migration)

ALTER TABLE carts
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;
