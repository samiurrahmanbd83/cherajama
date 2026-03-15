"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMarketingSchema = exports.marketingProviderSchema = void 0;
const zod_1 = require("zod");
const providers = ["meta_pixel", "facebook_capi", "tiktok_pixel"];
exports.marketingProviderSchema = zod_1.z.object({
    params: zod_1.z.object({
        provider: zod_1.z.enum(providers)
    })
});
exports.updateMarketingSchema = zod_1.z.object({
    params: zod_1.z.object({
        provider: zod_1.z.enum(providers)
    }),
    body: zod_1.z.object({
        tracking_id: zod_1.z.string().min(1).optional(),
        is_enabled: zod_1.z.boolean().optional(),
        config: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional()
    })
});
