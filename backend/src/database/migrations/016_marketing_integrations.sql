-- 016_marketing_integrations.sql
-- Marketing integrations for pixels and conversion APIs

CREATE TABLE IF NOT EXISTS marketing_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL CHECK (provider IN ('meta_pixel', 'facebook_capi', 'tiktok_pixel')),
  tracking_id TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (provider)
);

CREATE INDEX IF NOT EXISTS idx_marketing_integrations_provider ON marketing_integrations(provider);
