"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAdminImage = void 0;
const AppError_1 = require("../utils/AppError");
const supabase_1 = require("../database/supabase");
const DEFAULT_BUCKET = "uploads";
const uploadAdminImage = async (file, folder) => {
    if (!file) {
        throw new AppError_1.AppError("Image file is required.", 400);
    }
    const safeFolder = folder ? folder.replace(/[^a-zA-Z0-9-_]/g, "-") : "misc";
    const filename = `${Date.now()}-${file.originalname}`.replace(/\s+/g, "-");
    const objectPath = `${safeFolder}/${filename}`;
    const { error } = await supabase_1.supabase.storage
        .from(DEFAULT_BUCKET)
        .upload(objectPath, file.buffer, {
        contentType: file.mimetype,
        upsert: true
    });
    if (error) {
        throw new AppError_1.AppError(error.message, 500);
    }
    const { data: publicUrl } = supabase_1.supabase.storage.from(DEFAULT_BUCKET).getPublicUrl(objectPath);
    return {
        url: publicUrl.publicUrl,
        path: objectPath,
        bucket: DEFAULT_BUCKET
    };
};
exports.uploadAdminImage = uploadAdminImage;
