import type { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { getSettings, upsertSettings } from "../services/settings.service";

// Public: fetch website settings
export const getWebsiteSettings = async (_req: Request, res: Response) => {
  const settings = await getSettings();
  res.status(200).json({ success: true, data: { settings } });
};

// Admin: update website settings
export const updateWebsiteSettings = async (req: Request, res: Response) => {
  let socialLinks: Record<string, string> | undefined;

  if (typeof req.body.social_links === "string") {
    try {
      socialLinks = JSON.parse(req.body.social_links);
    } catch {
      throw new AppError("social_links must be valid JSON.", 400);
    }
  } else if (req.body.social_links) {
    socialLinks = req.body.social_links;
  }

  if (socialLinks) {
    socialLinks = Object.fromEntries(
      Object.entries(socialLinks).filter(([, value]) => Boolean(value))
    );
  }

  const logoFile = (req.files as Record<string, Express.Multer.File[]>)?.logo?.[0];
  const faviconFile = (req.files as Record<string, Express.Multer.File[]>)?.favicon?.[0];

  const settings = await upsertSettings({
    site_name: req.body.site_name,
    footer_text: req.body.footer_text,
    contact_email: req.body.contact_email,
    contact_phone: req.body.contact_phone,
    social_links: socialLinks,
    logo_file: logoFile,
    favicon_file: faviconFile
  });

  res.status(200).json({ success: true, data: { settings } });
};
