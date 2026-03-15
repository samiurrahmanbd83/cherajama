import type { Request, Response } from "express";
import { getOverviewStats, getRevenueSeries, getSalesSeries, getTopProducts } from "../services/analytics.service";

// Dashboard overview stats
export const overview = async (_req: Request, res: Response) => {
  const stats = await getOverviewStats();
  res.status(200).json({ success: true, data: { stats } });
};

// Daily sales chart data
export const sales = async (req: Request, res: Response) => {
  const days = Number(req.query.days || 30);
  const series = await getSalesSeries(days);
  res.status(200).json({ success: true, data: { series } });
};

// Monthly revenue chart data
export const revenue = async (req: Request, res: Response) => {
  const months = Number(req.query.months || 12);
  const series = await getRevenueSeries(months);
  res.status(200).json({ success: true, data: { series } });
};

// Top products by revenue
export const topProducts = async (req: Request, res: Response) => {
  const limit = Number(req.query.limit || 5);
  const products = await getTopProducts(limit);
  res.status(200).json({ success: true, data: { products } });
};
