import type { Request, Response } from "express";
import { createReview, listReviewsByProduct } from "../services/review.service";
import { getParam } from "../utils/request";

// List reviews for a product (public)
export const list = async (req: Request, res: Response) => {
  const reviews = await listReviewsByProduct(getParam(req.params, "id"));
  res.status(200).json({ success: true, data: { reviews } });
};

// Create review (authenticated)
export const create = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const review = await createReview(userId, getParam(req.params, "id"), req.body);
  res.status(201).json({ success: true, data: { review } });
};

