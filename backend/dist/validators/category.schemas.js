"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryIdSchema = exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2),
        parent_id: zod_1.z.string().uuid().optional(),
        description: zod_1.z.string().optional(),
        image: zod_1.z.string().url().optional(),
        imageUrl: zod_1.z.string().url().optional()
    })
});
exports.updateCategorySchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).optional(),
        parent_id: zod_1.z.string().uuid().optional(),
        description: zod_1.z.string().optional(),
        image: zod_1.z.string().url().optional(),
        imageUrl: zod_1.z.string().url().optional()
    })
});
exports.categoryIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    })
});
