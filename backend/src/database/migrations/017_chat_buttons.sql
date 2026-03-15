-- 017_chat_buttons.sql
-- Floating chat button configuration

CREATE TABLE IF NOT EXISTS chat_buttons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number TEXT,
  whatsapp_message TEXT,
  messenger_username TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_buttons_created ON chat_buttons(created_at);
