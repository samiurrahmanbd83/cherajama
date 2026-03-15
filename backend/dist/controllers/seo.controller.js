"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sitemap = exports.upsertSite = exports.upsertEntitySeo = exports.getSite = exports.getSeo = void 0;
const request_1 = require("../utils/request");
const seo_service_1 = require("../services/seo.service");
// Public: get SEO for entity
const getSeo = async (req, res) => {
    const seo = await (0, seo_service_1.getSeoByEntity)((0, request_1.getParam)(req.params, "entity_type"), (0, request_1.getParam)(req.params, "entity_id"));
    res.status(200).json({ success: true, data: { seo } });
};
exports.getSeo = getSeo;
// Public: get site SEO
const getSite = async (_req, res) => {
    const seo = await (0, seo_service_1.getSiteSeo)();
    res.status(200).json({ success: true, data: { seo } });
};
exports.getSite = getSite;
// Admin: upsert SEO for entity
const upsertEntitySeo = async (req, res) => {
    const seo = await (0, seo_service_1.upsertSeo)((0, request_1.getParam)(req.params, "entity_type"), (0, request_1.getParam)(req.params, "entity_id"), req.body);
    res.status(200).json({ success: true, data: { seo } });
};
exports.upsertEntitySeo = upsertEntitySeo;
// Admin: upsert site SEO
const upsertSite = async (req, res) => {
    const seo = await (0, seo_service_1.upsertSiteSeo)(req.body);
    res.status(200).json({ success: true, data: { seo } });
};
exports.upsertSite = upsertSite;
// Public: sitemap
const sitemap = async (_req, res) => {
    const xml = await (0, seo_service_1.generateSitemapXml)();
    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(xml);
};
exports.sitemap = sitemap;
