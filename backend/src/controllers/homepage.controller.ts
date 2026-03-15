import type { Request, Response } from "express";
import {
  createHomepage,
  createSection,
  deleteHomepage,
  deleteSection,
  getActiveHomepage,
  getHomepageById,
  getHomepageBySlug,
  listHomepages,
  listSections,
  reorderSections,
  updateHomepage,
  updateSection
} from "../services/homepage.service";
import { listHomepageSections } from "../services/homepageSections.service";
import { getParam } from "../utils/request";

// Public: get active homepage
export const getActive = async (_req: Request, res: Response) => {
  const homepage = await getActiveHomepage();
  const sections = await listHomepageSections();
  res.status(200).json({ success: true, data: { homepage, sections } });
};

// Public: get homepage by slug
export const getBySlug = async (req: Request, res: Response) => {
  const homepage = await getHomepageBySlug(getParam(req.params, "slug"));
  res.status(200).json({ success: true, data: { homepage } });
};

// Admin: list homepages
export const list = async (_req: Request, res: Response) => {
  const homepages = await listHomepages();
  res.status(200).json({ success: true, data: { homepages } });
};

// Admin: get homepage by id
export const getById = async (req: Request, res: Response) => {
  const homepage = await getHomepageById(getParam(req.params, "id"), true);
  res.status(200).json({ success: true, data: { homepage } });
};

// Admin: create homepage
export const create = async (req: Request, res: Response) => {
  const homepage = await createHomepage(req.body);
  res.status(201).json({ success: true, data: { homepage } });
};

// Admin: update homepage
export const update = async (req: Request, res: Response) => {
  const homepage = await updateHomepage(getParam(req.params, "id"), req.body);
  res.status(200).json({ success: true, data: { homepage } });
};

// Admin: delete homepage
export const remove = async (req: Request, res: Response) => {
  const result = await deleteHomepage(getParam(req.params, "id"));
  res.status(200).json({ success: true, data: result });
};

// Admin: list sections
export const listSectionItems = async (req: Request, res: Response) => {
  const sections = await listSections(getParam(req.params, "id"));
  res.status(200).json({ success: true, data: { sections } });
};

// Admin: create section
export const createSectionItem = async (req: Request, res: Response) => {
  const section = await createSection(getParam(req.params, "id"), req.body);
  res.status(201).json({ success: true, data: { section } });
};

// Admin: update section
export const updateSectionItem = async (req: Request, res: Response) => {
  const section = await updateSection(getParam(req.params, "sectionId"), req.body);
  res.status(200).json({ success: true, data: { section } });
};

// Admin: delete section
export const removeSectionItem = async (req: Request, res: Response) => {
  const result = await deleteSection(getParam(req.params, "sectionId"));
  res.status(200).json({ success: true, data: result });
};

// Admin: reorder sections
export const reorderSectionItems = async (req: Request, res: Response) => {
  const result = await reorderSections(getParam(req.params, "id"), req.body.items);
  res.status(200).json({ success: true, data: result });
};

