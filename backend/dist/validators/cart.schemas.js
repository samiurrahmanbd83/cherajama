"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCartItemSchema = exports.updateCartItemSchema = exports.addToCartSchema = void 0;
const zod_1 = require("zod");
exports.addToCartSchema = zod_1.z.object({
    body: zod_1.z.object({
        product_id: zod_1.z.string().uuid(),
        quantity: zod_1.z.coerce.number().int().positive().default(1)
    })
});
exports.updateCartItemSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    }),
    body: zod_1.z.object({
        quantity: zod_1.z.coerce.number().int().positive()
    })
});
exports.removeCartItemSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    })
});
