import type { Request, Response } from "express";
import { getParam } from "../utils/request";
import {
  generateSitemapXml,
  getSeoByEntity,
  getSiteSeo,
  upsertSeo,
  upsertSiteSeo
} from "../services/seo.service";

// Public: get SEO for entity
export const getSeo = async (req: Request, res: Response) => {
  const seo = await getSeoByEntity(getParam(req.params, "entity_type"), getParam(req.params, "entity_id"));
  res.status(200).json({ success: true, data: { seo } });
};

// Public: get site SEO
export const getSite = async (_req: Request, res: Response) => {
  const seo = await getSiteSeo();
  res.status(200).json({ success: true, data: { seo } });
};

// Admin: upsert SEO for entity
export const upsertEntitySeo = async (req: Request, res: Response) => {
  const seo = await upsertSeo(getParam(req.params, "entity_type"), getParam(req.params, "entity_id"), req.body);
  res.status(200).json({ success: true, data: { seo } });
};

// Admin: upsert site SEO
export const upsertSite = async (req: Request, res: Response) => {
  const seo = await upsertSiteSeo(req.body);
  res.status(200).json({ success: true, data: { seo } });
};

// Public: sitemap
export const sitemap = async (_req: Request, res: Response) => {
  const xml = await generateSitemapXml();
  res.setHeader("Content-Type", "application/xml");
  res.status(200).send(xml);
};

