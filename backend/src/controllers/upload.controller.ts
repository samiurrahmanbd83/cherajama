import type { Request, Response } from "express";
import { uploadAdminImage } from "../services/upload.service";

export const uploadImage = async (req: Request, res: Response) => {
  const result = await uploadAdminImage(req.file as Express.Multer.File, req.body?.folder);
  res.status(201).json({ success: true, data: result });
};
