"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSearchSchema = exports.productSlugSchema = exports.productIdSchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2),
        slug: zod_1.z.string().min(2),
        description: zod_1.z.string().optional(),
        price: zod_1.z.coerce.number().positive(),
        image: zod_1.z.string().url().optional(),
        category_id: zod_1.z.string().uuid().optional(),
        stock: zod_1.z.coerce.number().int().min(0).optional()
    })
});
exports.updateProductSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).optional(),
        slug: zod_1.z.string().min(2).optional(),
        description: zod_1.z.string().optional(),
        price: zod_1.z.coerce.number().positive().optional(),
        image: zod_1.z.string().url().optional(),
        category_id: zod_1.z.string().uuid().optional(),
        stock: zod_1.z.coerce.number().int().min(0).optional()
    })
});
exports.productIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    })
});
exports.productSlugSchema = zod_1.z.object({
    params: zod_1.z.object({
        slug: zod_1.z.string().min(2)
    })
});
exports.productSearchSchema = zod_1.z.object({
    query: zod_1.z.object({
        keyword: zod_1.z.string().min(2).optional(),
        category_id: zod_1.z.string().uuid().optional(),
        min_price: zod_1.z.coerce.number().nonnegative().optional(),
        max_price: zod_1.z.coerce.number().nonnegative().optional(),
        tag: zod_1.z.string().min(1).optional(),
        sort: zod_1.z.enum(["price_low_high", "price_high_low", "newest"]).optional()
    })
});
