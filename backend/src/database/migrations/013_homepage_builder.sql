-- 013_homepage_builder.sql
-- Dynamic homepage sections for drag-and-drop builder

CREATE TABLE IF NOT EXISTS homepages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS homepage_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  homepage_id UUID NOT NULL REFERENCES homepages(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'hero',
    'featured_products',
    'categories',
    'flash_sale',
    'promo_banners',
    'customer_reviews',
    'newsletter',
    'footer'
  )),
  title TEXT,
  subtitle TEXT,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_homepages_active ON homepages(is_active);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_homepage ON homepage_sections(homepage_id);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_type ON homepage_sections(type);
