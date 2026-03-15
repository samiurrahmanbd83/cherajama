import type { Request, Response } from "express";
import { getParam } from "../utils/request";
import {
  cancelOrder,
  createOrderFromCart,
  getOrderById,
  listOrders,
  updateOrderStatus
} from "../services/order.service";

// Create order from cart
export const create = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const order = await createOrderFromCart(userId, req.body);
  res.status(201).json({ success: true, data: { order } });
};

// Order history
export const history = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const role = req.user!.role;
  const orders = await listOrders(userId, role);
  res.status(200).json({ success: true, data: { orders } });
};

// Order tracking
export const track = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const role = req.user!.role;
  const order = await getOrderById(userId, role, getParam(req.params, "id"));
  res.status(200).json({ success: true, data: { order } });
};

// Cancel order
export const cancel = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const role = req.user!.role;
  const order = await cancelOrder(userId, role, getParam(req.params, "id"));
  res.status(200).json({ success: true, data: { order } });
};

// Admin: update order status
export const updateStatus = async (req: Request, res: Response) => {
  const order = await updateOrderStatus(getParam(req.params, "id"), req.body.status);
  res.status(200).json({ success: true, data: { order } });
};

