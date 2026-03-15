import { AppError } from "../utils/AppError";
import { supabase } from "../database/supabase";

const DEFAULT_BUCKET = "uploads";

export const uploadAdminImage = async (file: Express.Multer.File, folder?: string) => {
  if (!file) {
    throw new AppError("Image file is required.", 400);
  }

  const safeFolder = folder ? folder.replace(/[^a-zA-Z0-9-_]/g, "-") : "misc";
  const filename = `${Date.now()}-${file.originalname}`.replace(/\s+/g, "-");
  const objectPath = `${safeFolder}/${filename}`;

  const { error } = await supabase.storage
    .from(DEFAULT_BUCKET)
    .upload(objectPath, file.buffer, {
      contentType: file.mimetype,
      upsert: true
    });

  if (error) {
    throw new AppError(error.message, 500);
  }

  const { data: publicUrl } = supabase.storage.from(DEFAULT_BUCKET).getPublicUrl(objectPath);

  return {
    url: publicUrl.publicUrl,
    path: objectPath,
    bucket: DEFAULT_BUCKET
  };
};
