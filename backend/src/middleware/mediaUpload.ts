import fs from "fs";
import path from "path";
import multer from "multer";

const uploadsRoot = path.resolve(process.cwd(), "..", "uploads", "media");
const imageDir = path.join(uploadsRoot, "images");
const videoDir = path.join(uploadsRoot, "videos");

[uploadsRoot, imageDir, videoDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
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

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    cb(new Error("Unsupported file type."));
    return;
  }
  cb(null, true);
};

// Multer instance for media uploads (images and videos)
export const mediaUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024, files: 10 }
});
