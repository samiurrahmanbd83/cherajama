import path from "path";
import { db } from "../database/pool";

const uploadsPublicBase = "/uploads/settings";

const buildAssetUrl = (file?: Express.Multer.File) => {
  if (!file) return undefined;
  return `${uploadsPublicBase}/${path.basename(file.path)}`;
};

// Fetch the latest website settings
export const getSettings = async () => {
  const result = await db.query(
    `SELECT id, site_name, logo_url, favicon_url, footer_text, contact_email, contact_phone,
            social_links, created_at, updated_at
     FROM website_settings
     ORDER BY created_at DESC
     LIMIT 1`
  );
  return result.rows[0] || null;
};

// Create or update website settings
export const upsertSettings = async (input: {
  site_name?: string;
  footer_text?: string;
  contact_email?: string;
  contact_phone?: string;
  social_links?: Record<string, string>;
  logo_file?: Express.Multer.File;
  favicon_file?: Express.Multer.File;
}) => {
  const existing = await getSettings();

  const siteName = input.site_name ?? existing?.site_name ?? "Cherajama";
  const logoUrl = buildAssetUrl(input.logo_file) ?? existing?.logo_url ?? null;
  const faviconUrl = buildAssetUrl(input.favicon_file) ?? existing?.favicon_url ?? null;
  const footerText = input.footer_text ?? existing?.footer_text ?? null;
  const contactEmail = input.contact_email ?? existing?.contact_email ?? null;
  const contactPhone = input.contact_phone ?? existing?.contact_phone ?? null;
  const socialLinks = input.social_links ?? existing?.social_links ?? {};

  if (!existing) {
    const inserted = await db.query(
      `INSERT INTO website_settings
        (site_name, logo_url, favicon_url, footer_text, contact_email, contact_phone, social_links)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, site_name, logo_url, favicon_url, footer_text, contact_email, contact_phone,
                 social_links, created_at, updated_at`,
      [siteName, logoUrl, faviconUrl, footerText, contactEmail, contactPhone, socialLinks]
    );
    return inserted.rows[0];
  }

  const updated = await db.query(
    `UPDATE website_settings
     SET site_name = $1,
         logo_url = $2,
         favicon_url = $3,
         footer_text = $4,
         contact_email = $5,
         contact_phone = $6,
         social_links = $7,
         updated_at = NOW()
     WHERE id = $8
     RETURNING id, site_name, logo_url, favicon_url, footer_text, contact_email, contact_phone,
               social_links, created_at, updated_at`,
    [
      siteName,
      logoUrl,
      faviconUrl,
      footerText,
      contactEmail,
      contactPhone,
      socialLinks,
      existing.id
    ]
  );

  return updated.rows[0];
};
