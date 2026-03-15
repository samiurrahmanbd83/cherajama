"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMedia = exports.listMedia = exports.uploadMedia = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const pool_1 = require("../database/pool");
const AppError_1 = require("../utils/AppError");
const uploadsPublicBase = "/uploads/media";
const buildMediaUrl = (file) => {
    const folder = file.mimetype.startsWith("video/") ? "videos" : "images";
    return `${uploadsPublicBase}/${folder}/${path_1.default.basename(file.path)}`;
};
const resolveMediaPath = (url) => {
    const relative = url.replace(/^\/+/, "");
    return path_1.default.resolve(process.cwd(), "..", relative);
};
// Store uploaded media records in the database
const uploadMedia = async (files, userId) => {
    if (!files || files.length === 0) {
        throw new AppError_1.AppError("No media files uploaded.", 400);
    }
    const stored = [];
    for (const file of files) {
        const type = file.mimetype.startsWith("video/") ? "video" : "image";
        const url = buildMediaUrl(file);
        const result = await pool_1.db.query(`INSERT INTO media (type, url, file_name, mime_type, size_bytes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, type, url, file_name, mime_type, size_bytes, created_by, created_at`, [type, url, file.filename, file.mimetype, file.size, userId ?? null]);
        stored.push(result.rows[0]);
    }
    return stored;
};
exports.uploadMedia = uploadMedia;
// List media assets with optional filters
const listMedia = async (input) => {
    const filters = [];
    const values = [];
    let index = 1;
    if (input.type) {
        filters.push(`type = $${index}`);
        values.push(input.type);
        index += 1;
    }
    const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
    const limit = input.limit ?? 50;
    const offset = input.offset ?? 0;
    values.push(limit, offset);
    const result = await pool_1.db.query(`SELECT id, type, url, file_name, mime_type, size_bytes, created_by, created_at
     FROM media
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${index} OFFSET $${index + 1}`, values);
    return result.rows;
};
exports.listMedia = listMedia;
// Delete media asset record and its file on disk
const deleteMedia = async (mediaId) => {
    const record = await pool_1.db.query("SELECT id, url FROM media WHERE id = $1", [mediaId]);
    const media = record.rows[0];
    if (!media) {
        throw new AppError_1.AppError("Media not found.", 404);
    }
    await pool_1.db.query("DELETE FROM media WHERE id = $1", [mediaId]);
    const filePath = resolveMediaPath(media.url);
    try {
        await fs_1.default.promises.unlink(filePath);
    }
    catch (error) {
        if (error?.code !== "ENOENT") {
            throw error;
        }
    }
    return { id: media.id };
};
exports.deleteMedia = deleteMedia;
