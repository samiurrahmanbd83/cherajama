"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderSectionsSchema = exports.sectionIdSchema = exports.updateSectionSchema = exports.createSectionSchema = exports.homepageSlugSchema = exports.homepageIdSchema = exports.updateHomepageSchema = exports.createHomepageSchema = void 0;
const zod_1 = require("zod");
const sectionTypes = [
    "hero",
    "featured_products",
    "categories",
    "flash_sale",
    "promo_banners",
    "customer_reviews",
    "newsletter",
    "footer"
];
exports.createHomepageSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2),
        is_active: zod_1.z.boolean().optional()
    })
});
exports.updateHomepageSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).optional(),
        is_active: zod_1.z.boolean().optional()
    })
});
exports.homepageIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    })
});
exports.homepageSlugSchema = zod_1.z.object({
    params: zod_1.z.object({
        slug: zod_1.z.string().min(2)
    })
});
exports.createSectionSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    }),
    body: zod_1.z.object({
        type: zod_1.z.enum(sectionTypes),
        title: zod_1.z.string().min(1).optional(),
        subtitle: zod_1.z.string().min(1).optional(),
        config: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
        sort_order: zod_1.z.number().int().min(0).optional(),
        is_active: zod_1.z.boolean().optional()
    })
});
exports.updateSectionSchema = zod_1.z.object({
    params: zod_1.z.object({
        sectionId: zod_1.z.string().uuid()
    }),
    body: zod_1.z.object({
        type: zod_1.z.enum(sectionTypes).optional(),
        title: zod_1.z.string().min(1).nullable().optional(),
        subtitle: zod_1.z.string().min(1).nullable().optional(),
        config: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
        sort_order: zod_1.z.number().int().min(0).optional(),
        is_active: zod_1.z.boolean().optional()
    })
});
exports.sectionIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        sectionId: zod_1.z.string().uuid()
    })
});
exports.reorderSectionsSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    }),
    body: zod_1.z.object({
        items: zod_1.z.array(zod_1.z.object({
            id: zod_1.z.string().uuid(),
            sort_order: zod_1.z.number().int().min(0)
        })).min(1)
    })
});
