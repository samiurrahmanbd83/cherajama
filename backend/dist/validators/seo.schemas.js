"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertSeoEntitySchema = exports.seoSiteUpsertSchema = exports.upsertSeoSchema = exports.seoSiteSchema = exports.seoEntitySchema = void 0;
const zod_1 = require("zod");
const entityTypes = ["site", "homepage", "category", "product"];
exports.seoEntitySchema = zod_1.z.object({
    params: zod_1.z.object({
        entity_type: zod_1.z.enum(entityTypes),
        entity_id: zod_1.z.string().uuid()
    })
});
exports.seoSiteSchema = zod_1.z.object({
    params: zod_1.z.object({})
});
exports.upsertSeoSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1).optional(),
        meta_description: zod_1.z.string().min(1).optional(),
        meta_keywords: zod_1.z.array(zod_1.z.string().min(1)).optional(),
        og_title: zod_1.z.string().min(1).optional(),
        og_description: zod_1.z.string().min(1).optional(),
        og_image: zod_1.z.string().url().optional(),
        og_type: zod_1.z.string().min(1).optional(),
        canonical_url: zod_1.z.string().url().optional(),
        noindex: zod_1.z.boolean().optional(),
        nofollow: zod_1.z.boolean().optional()
    })
});
exports.seoSiteUpsertSchema = zod_1.z.object({
    body: exports.upsertSeoSchema.shape.body
});
exports.upsertSeoEntitySchema = zod_1.z.object({
    params: exports.seoEntitySchema.shape.params,
    body: exports.upsertSeoSchema.shape.body
});
