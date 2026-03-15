"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageBatch = exports.uploadImageBuffer = void 0;
const cloudinary_1 = require("cloudinary");
const streamifier_1 = __importDefault(require("streamifier"));
const env_1 = require("../config/env");
const AppError_1 = require("../utils/AppError");
let configured = false;
const ensureConfigured = () => {
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = env_1.env;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
        throw new AppError_1.AppError("Cloudinary credentials are not configured.", 500);
    }
    if (!configured) {
        cloudinary_1.v2.config({
            cloud_name: CLOUDINARY_CLOUD_NAME,
            api_key: CLOUDINARY_API_KEY,
            api_secret: CLOUDINARY_API_SECRET,
            secure: true
        });
        configured = true;
    }
};
const uploadBuffer = (file, folder) => new Promise((resolve, reject) => {
    if (!file?.buffer) {
        reject(new AppError_1.AppError("Image buffer missing for upload.", 400));
        return;
    }
    const stream = cloudinary_1.v2.uploader.upload_stream({
        folder,
        resource_type: "image",
        use_filename: true,
        unique_filename: true,
        overwrite: false
    }, (error, result) => {
        if (error || !result) {
            reject(new AppError_1.AppError(error?.message || "Cloudinary upload failed.", 500));
            return;
        }
        resolve(result);
    });
    streamifier_1.default.createReadStream(file.buffer).pipe(stream);
});
const uploadImageBuffer = async (file, folder) => {
    ensureConfigured();
    const result = await uploadBuffer(file, folder);
    return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height
    };
};
exports.uploadImageBuffer = uploadImageBuffer;
const uploadImageBatch = async (files, folder) => {
    ensureConfigured();
    if (!files?.length)
        return [];
    const uploads = await Promise.all(files.map((file) => uploadBuffer(file, folder)));
    return uploads.map((result) => ({
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height
    }));
};
exports.uploadImageBatch = uploadImageBatch;
