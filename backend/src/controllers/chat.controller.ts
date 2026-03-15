import type { Request, Response } from "express";
import { getChatButtons, upsertChatButtons } from "../services/chat.service";

// Public: fetch chat button settings
export const getChatSettings = async (_req: Request, res: Response) => {
  const settings = await getChatButtons();
  res.status(200).json({ success: true, data: { settings } });
};

// Admin: update chat button settings
export const updateChatSettings = async (req: Request, res: Response) => {
  const settings = await upsertChatButtons(req.body);
  res.status(200).json({ success: true, data: { settings } });
};
