"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHomepageSectionSchema = exports.updateHomepageSectionSchema = exports.createHomepageSectionSchema = void 0;
const zod_1 = require("zod");
const sectionTypeSchema = zod_1.z.enum([
    "hero",
    "featured_products",
    "categories",
    "promo_banners",
    "customer_reviews",
    "newsletter",
    "footer",
    "flash_sale"
]);
exports.createHomepageSectionSchema = zod_1.z.object({
    body: zod_1.z.object({
        type: sectionTypeSchema,
        title: zod_1.z.string().min(1).optional(),
        content: zod_1.z.string().optional(),
        image: zod_1.z.string().url().optional(),
        position: zod_1.z.number().int().positive().optional(),
        is_active: zod_1.z.boolean().optional()
    })
});
exports.updateHomepageSectionSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    }),
    body: zod_1.z.object({
        type: sectionTypeSchema.optional(),
        title: zod_1.z.string().min(1).optional(),
        content: zod_1.z.string().optional(),
        image: zod_1.z.string().url().optional(),
        position: zod_1.z.number().int().positive().optional(),
        is_active: zod_1.z.boolean().optional()
    })
});
exports.deleteHomepageSectionSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    })
});
