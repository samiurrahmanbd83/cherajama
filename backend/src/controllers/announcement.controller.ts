import type { Request, Response } from "express";
import { getParam } from "../utils/request";
import {
  createAnnouncement,
  getAnnouncement,
  toggleAnnouncement,
  updateAnnouncement
} from "../services/announcement.service";

// Public: fetch latest announcement
export const getLatest = async (_req: Request, res: Response) => {
  const announcement = await getAnnouncement();
  res.status(200).json({ success: true, data: { announcement } });
};

// Admin: create announcement
export const create = async (req: Request, res: Response) => {
  const announcement = await createAnnouncement(req.body);
  res.status(201).json({ success: true, data: { announcement } });
};

// Admin: update announcement
export const update = async (req: Request, res: Response) => {
  const announcement = await updateAnnouncement(getParam(req.params, "id"), req.body);
  res.status(200).json({ success: true, data: { announcement } });
};

// Admin: toggle announcement
export const toggle = async (req: Request, res: Response) => {
  const announcement = await toggleAnnouncement(req.body.is_active);
  res.status(200).json({ success: true, data: { announcement } });
};

