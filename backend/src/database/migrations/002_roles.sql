-- 002_roles.sql
-- Roles table and role assignment for users

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES roles(id) ON DELETE SET NULL;

-- Seed default roles
INSERT INTO roles (name)
VALUES ('admin'), ('staff'), ('customer')
ON CONFLICT (name) DO NOTHING;

-- Backfill existing users with customer role if missing
UPDATE users
SET role_id = (SELECT id FROM roles WHERE name = 'customer')
WHERE role_id IS NULL;
