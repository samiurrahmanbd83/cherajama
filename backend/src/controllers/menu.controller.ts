import type { Request, Response } from "express";
import { getParam } from "../utils/request";
import {
  addMenuItem,
  createMenu,
  deleteMenu,
  deleteMenuItem,
  getMenuBySlug,
  listMenus,
  reorderMenuItems,
  updateMenu,
  updateMenuItem
} from "../services/menu.service";

// List menus (public)
export const list = async (_req: Request, res: Response) => {
  const menus = await listMenus();
  res.status(200).json({ success: true, data: { menus } });
};

// Get menu details by slug (public)
export const getBySlug = async (req: Request, res: Response) => {
  const menu = await getMenuBySlug(getParam(req.params, "slug"));
  res.status(200).json({ success: true, data: { menu } });
};

// Create menu (admin)
export const create = async (req: Request, res: Response) => {
  const menu = await createMenu(req.body);
  res.status(201).json({ success: true, data: { menu } });
};

// Update menu (admin)
export const update = async (req: Request, res: Response) => {
  const menu = await updateMenu(getParam(req.params, "id"), req.body);
  res.status(200).json({ success: true, data: { menu } });
};

// Delete menu (admin)
export const remove = async (req: Request, res: Response) => {
  const result = await deleteMenu(getParam(req.params, "id"));
  res.status(200).json({ success: true, data: result });
};

// Add menu item (admin)
export const addItem = async (req: Request, res: Response) => {
  const item = await addMenuItem(getParam(req.params, "id"), req.body);
  res.status(201).json({ success: true, data: { item } });
};

// Update menu item (admin)
export const updateItem = async (req: Request, res: Response) => {
  const item = await updateMenuItem(getParam(req.params, "itemId"), req.body);
  res.status(200).json({ success: true, data: { item } });
};

// Delete menu item (admin)
export const removeItem = async (req: Request, res: Response) => {
  const result = await deleteMenuItem(getParam(req.params, "itemId"));
  res.status(200).json({ success: true, data: result });
};

// Reorder menu items (admin)
export const reorder = async (req: Request, res: Response) => {
  const result = await reorderMenuItems(getParam(req.params, "id"), req.body.items);
  res.status(200).json({ success: true, data: result });
};

