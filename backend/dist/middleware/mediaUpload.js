"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaUpload = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const uploadsRoot = path_1.default.resolve(process.cwd(), "..", "uploads", "media");
const imageDir = path_1.default.join(uploadsRoot, "images");
const videoDir = path_1.default.join(uploadsRoot, "videos");
[uploadsRoot, imageDir, videoDir].forEach((dir) => {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
});
const storage = multer_1.default.diskStorage({
    destination: (_req, file, cb) => {
        const isVideo = file.mimetype.startsWith("video/");
        cb(null, isVideo ? videoDir : imageDir);
    },
    filename: (_req, file, cb) => {
        const timestamp = Date.now();
        const safeName = file.originalname.replace(/\s+/g, "-").toLowerCase();
        cb(null, `${timestamp}-${safeName}`);
    }
});
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "video/mp4"];
const fileFilter = (_req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
        cb(new Error("Unsupported file type."));
        return;
    }
    cb(null, true);
};
// Multer instance for media uploads (images and videos)
exports.mediaUpload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 25 * 1024 * 1024, files: 10 }
});
