"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGatewaySchema = exports.toggleGatewaySchema = exports.gatewayIdSchema = void 0;
const zod_1 = require("zod");
exports.gatewayIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    })
});
exports.toggleGatewaySchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    }),
    body: zod_1.z.object({
        is_active: zod_1.z.boolean()
    })
});
exports.updateGatewaySchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).optional(),
        gateway_code: zod_1.z.string().min(2).optional(),
        is_active: zod_1.z.boolean().optional()
    })
});
