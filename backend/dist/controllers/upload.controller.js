"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const upload_service_1 = require("../services/upload.service");
const uploadImage = async (req, res) => {
    const result = await (0, upload_service_1.uploadAdminImage)(req.file, req.body?.folder);
    res.status(201).json({ success: true, data: result });
};
exports.uploadImage = uploadImage;
