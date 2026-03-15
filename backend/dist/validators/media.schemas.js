"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaIdSchema = exports.mediaListSchema = void 0;
const zod_1 = require("zod");
exports.mediaListSchema = zod_1.z.object({
    query: zod_1.z.object({
        type: zod_1.z.enum(["image", "video"]).optional(),
        limit: zod_1.z.preprocess((value) => (value === undefined || value === "" ? undefined : Number(value)), zod_1.z.number().int().min(1).max(100).optional()),
        offset: zod_1.z.preprocess((value) => (value === undefined || value === "" ? undefined : Number(value)), zod_1.z.number().int().min(0).optional())
    })
});
exports.mediaIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    })
});
