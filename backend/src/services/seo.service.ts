import { db } from "../database/pool";
import { env } from "../config/env";

export type SeoInput = {
  title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_type?: string;
  canonical_url?: string;
  noindex?: boolean;
  nofollow?: boolean;
};

const normalizeKeywords = (keywords?: string[]) => {
  if (!keywords) return undefined;
  const cleaned = keywords
    .map((keyword) => keyword.trim())
    .filter((keyword) => Boolean(keyword));
  return cleaned.length ? cleaned : null;
};

export const getSeoByEntity = async (entityType: string, entityId: string | null) => {
  const result = await db.query(
    `SELECT id, entity_type, entity_id, title, meta_description, meta_keywords,
            og_title, og_description, og_image, og_type, canonical_url, noindex, nofollow,
            created_at, updated_at
     FROM seo_settings
     WHERE entity_type = $1 AND entity_id IS NOT DISTINCT FROM $2`,
    [entityType, entityId]
  );

  return result.rows[0] || null;
};

export const upsertSeo = async (
  entityType: string,
  entityId: string | null,
  input: SeoInput
) => {
  const keywords = normalizeKeywords(input.meta_keywords);

  const result = await db.query(
    `INSERT INTO seo_settings (
      entity_type, entity_id, title, meta_description, meta_keywords,
      og_title, og_description, og_image, og_type, canonical_url, noindex, nofollow
    )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     ON CONFLICT (entity_type, entity_id)
     DO UPDATE SET
       title = EXCLUDED.title,
       meta_description = EXCLUDED.meta_description,
       meta_keywords = EXCLUDED.meta_keywords,
       og_title = EXCLUDED.og_title,
       og_description = EXCLUDED.og_description,
       og_image = EXCLUDED.og_image,
       og_type = EXCLUDED.og_type,
       canonical_url = EXCLUDED.canonical_url,
       noindex = EXCLUDED.noindex,
       nofollow = EXCLUDED.nofollow,
       updated_at = NOW()
     RETURNING id, entity_type, entity_id, title, meta_description, meta_keywords,
               og_title, og_description, og_image, og_type, canonical_url, noindex, nofollow,
               created_at, updated_at`,
    [
      entityType,
      entityId,
      input.title ?? null,
      input.meta_description ?? null,
      keywords ?? null,
      input.og_title ?? null,
      input.og_description ?? null,
      input.og_image ?? null,
      input.og_type ?? null,
      input.canonical_url ?? null,
      input.noindex ?? false,
      input.nofollow ?? false
    ]
  );

  return result.rows[0];
};

export const getSiteSeo = async () => getSeoByEntity("site", null);

export const upsertSiteSeo = async (input: SeoInput) => upsertSeo("site", null, input);

export const generateSitemapXml = async () => {
  const baseUrl = env.SITE_URL.replace(/\/$/, "");

  const productResult = await db.query(
    "SELECT slug, updated_at FROM products"
  );

  const categoryResult = await db.query(
    "SELECT slug, updated_at FROM categories"
  );

  const urls: Array<{ loc: string; lastmod?: string }> = [
    { loc: `${baseUrl}/` }
  ];

  productResult.rows.forEach((product: any) => {
    const lastmod = product.updated_at ? new Date(product.updated_at).toISOString() : undefined;
    urls.push({
      loc: `${baseUrl}/products/${product.slug}`,
      lastmod
    });
  });

  categoryResult.rows.forEach((category: any) => {
    const lastmod = category.updated_at ? new Date(category.updated_at).toISOString() : undefined;
    urls.push({
      loc: `${baseUrl}/categories/${category.slug}`,
      lastmod
    });
  });

  const urlset = urls
    .map((url) => {
      const lastmod = url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : "";
      return `<url><loc>${url.loc}</loc>${lastmod}</url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlset}</urlset>`;
};
