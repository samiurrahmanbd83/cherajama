"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateChatButtonsSchema = void 0;
const zod_1 = require("zod");
exports.updateChatButtonsSchema = zod_1.z.object({
    body: zod_1.z.object({
        whatsapp_number: zod_1.z.string().min(5).optional(),
        whatsapp_message: zod_1.z.string().min(1).optional(),
        messenger_username: zod_1.z.string().min(2).optional(),
        is_enabled: zod_1.z.boolean().optional()
    })
});
