import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import type { UploadApiResponse } from "cloudinary";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";

let configured = false;

const ensureConfigured = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new AppError("Cloudinary credentials are not configured.", 500);
  }

  if (!configured) {
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      secure: true
    });
    configured = true;
  }
};

type UploadResult = {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
};

const uploadBuffer = (file: Express.Multer.File, folder: string) =>
  new Promise<UploadApiResponse>((resolve, reject) => {
    if (!file?.buffer) {
      reject(new AppError("Image buffer missing for upload.", 400));
      return;
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        use_filename: true,
        unique_filename: true,
        overwrite: false
      },
      (error, result) => {
        if (error || !result) {
          reject(new AppError(error?.message || "Cloudinary upload failed.", 500));
          return;
        }
        resolve(result);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });

export const uploadImageBuffer = async (file: Express.Multer.File, folder: string) => {
  ensureConfigured();
  const result = await uploadBuffer(file, folder);
  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height
  } satisfies UploadResult;
};

export const uploadImageBatch = async (files: Express.Multer.File[], folder: string) => {
  ensureConfigured();
  if (!files?.length) return [];
  const uploads = await Promise.all(files.map((file) => uploadBuffer(file, folder)));
  return uploads.map((result) => ({
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height
  })) satisfies UploadResult[];
};
