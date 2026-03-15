import path from "path";
import fs from "fs";
import { db } from "../database/pool";
import { AppError } from "../utils/AppError";

const uploadsPublicBase = "/uploads/media";

const buildMediaUrl = (file: Express.Multer.File) => {
  const folder = file.mimetype.startsWith("video/") ? "videos" : "images";
  return `${uploadsPublicBase}/${folder}/${path.basename(file.path)}`;
};

const resolveMediaPath = (url: string) => {
  const relative = url.replace(/^\/+/, "");
  return path.resolve(process.cwd(), "..", relative);
};

// Store uploaded media records in the database
export const uploadMedia = async (files: Express.Multer.File[], userId?: string) => {
  if (!files || files.length === 0) {
    throw new AppError("No media files uploaded.", 400);
  }

  type StoredMedia = {
    id: string;
    type: "image" | "video";
    url: string;
    file_name: string;
    mime_type: string;
    size_bytes: number;
    created_by: string | null;
    created_at: string;
  };

  const stored: StoredMedia[] = [];

  for (const file of files) {
    const type = file.mimetype.startsWith("video/") ? "video" : "image";
    const url = buildMediaUrl(file);

    const result = await db.query<StoredMedia>(
      `INSERT INTO media (type, url, file_name, mime_type, size_bytes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, type, url, file_name, mime_type, size_bytes, created_by, created_at`,
      [type, url, file.filename, file.mimetype, file.size, userId ?? null]
    );

    stored.push(result.rows[0]);
  }

  return stored;
};

// List media assets with optional filters
export const listMedia = async (input: {
  type?: "image" | "video";
  limit?: number;
  offset?: number;
}) => {
  const filters: string[] = [];
  const values: Array<string | number> = [];
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

  const result = await db.query(
    `SELECT id, type, url, file_name, mime_type, size_bytes, created_by, created_at
     FROM media
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${index} OFFSET $${index + 1}`,
    values
  );

  return result.rows;
};

// Delete media asset record and its file on disk
export const deleteMedia = async (mediaId: string) => {
  const record = await db.query<{ id: string; url: string }>(
    "SELECT id, url FROM media WHERE id = $1",
    [mediaId]
  );

  const media = record.rows[0];
  if (!media) {
    throw new AppError("Media not found.", 404);
  }

  await db.query("DELETE FROM media WHERE id = $1", [mediaId]);

  const filePath = resolveMediaPath(media.url);
  try {
    await fs.promises.unlink(filePath);
  } catch (error: any) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
  }

  return { id: media.id };
};
