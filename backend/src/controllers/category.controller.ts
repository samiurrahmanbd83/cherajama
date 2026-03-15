import type { Request, Response } from "express";
import { getParam } from "../utils/request";
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory
} from "../services/category.service";

// List categories (public)
export const list = async (_req: Request, res: Response) => {
  const categories = await listCategories();
  res.status(200).json({ success: true, data: { categories } });
};

// Create category (admin)
export const create = async (req: Request, res: Response) => {
  const category = await createCategory({
    ...req.body,
    image: req.body?.image || req.body?.imageUrl
  });
  res.status(201).json({ success: true, data: { category } });
};

// Update category (admin)
export const update = async (req: Request, res: Response) => {
  const category = await updateCategory(getParam(req.params, "id"), {
    ...req.body,
    image: req.body?.image || req.body?.imageUrl
  });
  res.status(200).json({ success: true, data: { category } });
};

// Delete category (admin)
export const remove = async (req: Request, res: Response) => {
  const result = await deleteCategory(getParam(req.params, "id"));
  res.status(200).json({ success: true, data: result });
};

