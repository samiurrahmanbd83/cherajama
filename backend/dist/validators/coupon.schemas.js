"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCouponSchema = exports.createCouponSchema = exports.couponIdSchema = void 0;
const zod_1 = require("zod");
exports.couponIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    })
});
exports.createCouponSchema = zod_1.z.object({
    body: zod_1.z.object({
        code: zod_1.z.string().min(3),
        discount_type: zod_1.z.enum(["percentage", "fixed"]),
        discount_value: zod_1.z.coerce.number().positive(),
        minimum_order: zod_1.z.coerce.number().nonnegative().optional(),
        expiry_date: zod_1.z.string().datetime().optional()
    })
});
exports.updateCouponSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    }),
    body: zod_1.z.object({
        code: zod_1.z.string().min(3).optional(),
        discount_type: zod_1.z.enum(["percentage", "fixed"]).optional(),
        discount_value: zod_1.z.coerce.number().positive().optional(),
        minimum_order: zod_1.z.coerce.number().nonnegative().optional(),
        expiry_date: zod_1.z.string().datetime().optional()
    })
});
