import type { Request, Response } from "express";
import { createCoupon, deleteCoupon, listCoupons, updateCoupon } from "../services/coupon.service";
import { getParam } from "../utils/request";

// Create coupon (admin)
export const create = async (req: Request, res: Response) => {
  const coupon = await createCoupon(req.body);
  res.status(201).json({ success: true, data: { coupon } });
};

// List coupons (admin)
export const list = async (_req: Request, res: Response) => {
  const coupons = await listCoupons();
  res.status(200).json({ success: true, data: { coupons } });
};

// Update coupon (admin)
export const update = async (req: Request, res: Response) => {
  const coupon = await updateCoupon(getParam(req.params, "id"), req.body);
  res.status(200).json({ success: true, data: { coupon } });
};

// Delete coupon (admin)
export const remove = async (req: Request, res: Response) => {
  const result = await deleteCoupon(getParam(req.params, "id"));
  res.status(200).json({ success: true, data: result });
};

