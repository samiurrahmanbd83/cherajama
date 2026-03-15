import type { Request, Response } from "express";
import { getParam } from "../utils/request";
import {
  createProduct,
  deleteProduct,
  getProductBySlug,
  listProducts,
  searchProducts,
  updateProduct
} from "../services/product.service";

// List products (public)
export const list = async (_req: Request, res: Response) => {
  const products = await listProducts();
  res.status(200).json({ success: true, data: { products } });
};

// Get product details by slug (public)
export const getBySlug = async (req: Request, res: Response) => {
  const product = await getProductBySlug(getParam(req.params, "slug"));
  res.status(200).json({ success: true, data: { product } });
};

// Search products with filters (public)
export const search = async (req: Request, res: Response) => {
  const products = await searchProducts(req.query as any);
  res.status(200).json({ success: true, data: { products } });
};

// Create product (admin)
export const create = async (req: Request, res: Response) => {
  const product = await createProduct({
    ...req.body,
    files: req.files as Express.Multer.File[]
  });
  res.status(201).json({ success: true, data: { product } });
};

// Update product (admin)
export const update = async (req: Request, res: Response) => {
  const product = await updateProduct(getParam(req.params, "id"), {
    ...req.body,
    files: req.files as Express.Multer.File[]
  });
  res.status(200).json({ success: true, data: { product } });
};

// Delete product (admin)
export const remove = async (req: Request, res: Response) => {
  const result = await deleteProduct(getParam(req.params, "id"));
  res.status(200).json({ success: true, data: result });
};

