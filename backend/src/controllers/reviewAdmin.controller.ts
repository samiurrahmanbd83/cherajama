import type { Request, Response } from "express";
import { listAllReviews, updateReviewApproval } from "../services/review.service";
import { getParam } from "../utils/request";

export const list = async (req: Request, res: Response) => {
  const reviews = await listAllReviews(req.query as any);
  res.status(200).json({ success: true, data: { reviews } });
};

export const updateApproval = async (req: Request, res: Response) => {
  const review = await updateReviewApproval(getParam(req.params, "id"), req.body.is_approved);
  res.status(200).json({ success: true, data: { review } });
};

