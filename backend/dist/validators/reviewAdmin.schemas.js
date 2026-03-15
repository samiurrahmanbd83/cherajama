"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewAdminUpdateSchema = exports.reviewAdminListSchema = void 0;
const zod_1 = require("zod");
exports.reviewAdminListSchema = zod_1.z.object({
    query: zod_1.z.object({
        status: zod_1.z.enum(["approved", "pending"]).optional(),
        limit: zod_1.z.preprocess((value) => (value === undefined || value === "" ? undefined : Number(value)), zod_1.z.number().int().min(1).max(100).optional()),
        offset: zod_1.z.preprocess((value) => (value === undefined || value === "" ? undefined : Number(value)), zod_1.z.number().int().min(0).optional())
    })
});
exports.reviewAdminUpdateSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    }),
    body: zod_1.z.object({
        is_approved: zod_1.z.boolean()
    })
});
