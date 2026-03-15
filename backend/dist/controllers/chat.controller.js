"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateChatSettings = exports.getChatSettings = void 0;
const chat_service_1 = require("../services/chat.service");
// Public: fetch chat button settings
const getChatSettings = async (_req, res) => {
    const settings = await (0, chat_service_1.getChatButtons)();
    res.status(200).json({ success: true, data: { settings } });
};
exports.getChatSettings = getChatSettings;
// Admin: update chat button settings
const updateChatSettings = async (req, res) => {
    const settings = await (0, chat_service_1.upsertChatButtons)(req.body);
    res.status(200).json({ success: true, data: { settings } });
};
exports.updateChatSettings = updateChatSettings;
