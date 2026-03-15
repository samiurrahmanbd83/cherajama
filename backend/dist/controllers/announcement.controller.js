"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggle = exports.update = exports.create = exports.getLatest = void 0;
const request_1 = require("../utils/request");
const announcement_service_1 = require("../services/announcement.service");
// Public: fetch latest announcement
const getLatest = async (_req, res) => {
    const announcement = await (0, announcement_service_1.getAnnouncement)();
    res.status(200).json({ success: true, data: { announcement } });
};
exports.getLatest = getLatest;
// Admin: create announcement
const create = async (req, res) => {
    const announcement = await (0, announcement_service_1.createAnnouncement)(req.body);
    res.status(201).json({ success: true, data: { announcement } });
};
exports.create = create;
// Admin: update announcement
const update = async (req, res) => {
    const announcement = await (0, announcement_service_1.updateAnnouncement)((0, request_1.getParam)(req.params, "id"), req.body);
    res.status(200).json({ success: true, data: { announcement } });
};
exports.update = update;
// Admin: toggle announcement
const toggle = async (req, res) => {
    const announcement = await (0, announcement_service_1.toggleAnnouncement)(req.body.is_active);
    res.status(200).json({ success: true, data: { announcement } });
};
exports.toggle = toggle;
