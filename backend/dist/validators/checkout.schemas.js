"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutSchema = void 0;
const zod_1 = require("zod");
exports.checkoutSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2),
        phone: zod_1.z.string().min(6),
        email: zod_1.z.string().email(),
        shipping_address: zod_1.z.string().min(5),
        city: zod_1.z.string().min(2),
        postal_code: zod_1.z.string().min(3)
    })
});
