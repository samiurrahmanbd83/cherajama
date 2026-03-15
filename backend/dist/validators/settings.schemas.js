"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettingsSchema = void 0;
const zod_1 = require("zod");
exports.updateSettingsSchema = zod_1.z.object({
    body: zod_1.z.object({
        site_name: zod_1.z.string().min(2).optional(),
        footer_text: zod_1.z.string().optional(),
        contact_email: zod_1.z.string().email().optional(),
        contact_phone: zod_1.z.string().min(5).optional(),
        social_links: zod_1.z.union([zod_1.z.record(zod_1.z.string(), zod_1.z.string().url()), zod_1.z.string().min(2)]).optional()
    })
});
