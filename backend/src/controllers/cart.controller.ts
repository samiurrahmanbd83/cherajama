import type { Request, Response } from "express";
import { addToCart, getCart, removeCartItem, updateCartItem } from "../services/cart.service";
import { getParam } from "../utils/request";

// View cart
export const viewCart = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const cart = await getCart(userId);
  res.status(200).json({ success: true, data: { cart } });
};

// Add item to cart
export const addItem = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const cart = await addToCart(userId, req.body);
  res.status(200).json({ success: true, data: { cart } });
};

// Update cart item quantity
export const updateItem = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const cart = await updateCartItem(userId, getParam(req.params, "id"), req.body.quantity);
  res.status(200).json({ success: true, data: { cart } });
};

// Remove item from cart
export const removeItem = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const cart = await removeCartItem(userId, getParam(req.params, "id"));
  res.status(200).json({ success: true, data: { cart } });
};

