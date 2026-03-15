"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReviewSchema = exports.reviewProductIdSchema = void 0;
const zod_1 = require("zod");
exports.reviewProductIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    })
});
exports.createReviewSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    }),
    body: zod_1.z.object({
        rating: zod_1.z.coerce.number().int().min(1).max(5),
        comment: zod_1.z.string().min(3)
    })
});
