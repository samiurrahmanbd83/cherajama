import type { Request, Response } from "express";
import { checkout, getCheckoutSummary } from "../services/checkout.service";

// Return checkout summary for current cart
export const summary = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const data = await getCheckoutSummary(userId);
  res.status(200).json({ success: true, data });
};

// Create order from current cart
export const placeOrder = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const order = await checkout(userId, req.body);
  res.status(201).json({ success: true, data: { order } });
};
