import type { Request, Response } from "express";
import { deleteMedia, listMedia, uploadMedia } from "../services/media.service";
import { getParam } from "../utils/request";

// List media items for the gallery
export const list = async (req: Request, res: Response) => {
  const media = await listMedia(req.query as any);
  res.status(200).json({ success: true, data: { media } });
};

// Upload new media assets
export const upload = async (req: Request, res: Response) => {
  const media = await uploadMedia(req.files as Express.Multer.File[], req.user?.id);
  res.status(201).json({ success: true, data: { media } });
};

// Remove media asset
export const remove = async (req: Request, res: Response) => {
  const result = await deleteMedia(getParam(req.params, "id"));
  res.status(200).json({ success: true, data: result });
};

