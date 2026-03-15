"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.upload = exports.list = void 0;
const media_service_1 = require("../services/media.service");
const request_1 = require("../utils/request");
// List media items for the gallery
const list = async (req, res) => {
    const media = await (0, media_service_1.listMedia)(req.query);
    res.status(200).json({ success: true, data: { media } });
};
exports.list = list;
// Upload new media assets
const upload = async (req, res) => {
    const media = await (0, media_service_1.uploadMedia)(req.files, req.user?.id);
    res.status(201).json({ success: true, data: { media } });
};
exports.upload = upload;
// Remove media asset
const remove = async (req, res) => {
    const result = await (0, media_service_1.deleteMedia)((0, request_1.getParam)(req.params, "id"));
    res.status(200).json({ success: true, data: result });
};
exports.remove = remove;
