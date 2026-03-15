"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryImageUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const fileFilter = (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
        cb(new Error("Only image uploads are allowed."));
        return;
    }
    cb(null, true);
};
// Multer instance for category image uploads
exports.categoryImageUpload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 8 * 1024 * 1024, files: 1 }
});
