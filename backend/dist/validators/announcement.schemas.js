"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleAnnouncementSchema = exports.updateAnnouncementSchema = exports.createAnnouncementSchema = void 0;
const zod_1 = require("zod");
const colorRegex = /^#([0-9a-fA-F]{3}){1,2}$/;
exports.createAnnouncementSchema = zod_1.z.object({
    body: zod_1.z.object({
        message: zod_1.z.string().min(1),
        link_url: zod_1.z.string().url().optional(),
        background_color: zod_1.z.string().regex(colorRegex).optional(),
        text_color: zod_1.z.string().regex(colorRegex).optional(),
        is_active: zod_1.z.boolean().optional()
    })
});
exports.updateAnnouncementSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    }),
    body: zod_1.z.object({
        message: zod_1.z.string().min(1).optional(),
        link_url: zod_1.z.string().url().nullable().optional(),
        background_color: zod_1.z.string().regex(colorRegex).optional(),
        text_color: zod_1.z.string().regex(colorRegex).optional(),
        is_active: zod_1.z.boolean().optional()
    })
});
exports.toggleAnnouncementSchema = zod_1.z.object({
    body: zod_1.z.object({
        is_active: zod_1.z.boolean()
    })
});
