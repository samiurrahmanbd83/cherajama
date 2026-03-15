import type { Request, Response } from "express";
import { getParam } from "../utils/request";
import {
  createHomepageSection,
  deleteHomepageSection,
  listHomepageSections,
  updateHomepageSection
} from "../services/homepageSections.service";

// Public: list homepage sections
export const listSections = async (_req: Request, res: Response) => {
  const sections = await listHomepageSections();
  res.status(200).json({ success: true, data: { sections } });
};

// Admin: create section
export const createSection = async (req: Request, res: Response) => {
  const section = await createHomepageSection(req.body);
  res.status(201).json({ success: true, data: { section } });
};

// Admin: update section
export const updateSection = async (req: Request, res: Response) => {
  const section = await updateHomepageSection(getParam(req.params, "id"), req.body);
  res.status(200).json({ success: true, data: { section } });
};

// Admin: delete section
export const deleteSection = async (req: Request, res: Response) => {
  const result = await deleteHomepageSection(getParam(req.params, "id"));
  res.status(200).json({ success: true, data: result });
};

