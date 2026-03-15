import type { Request, Response } from "express";
import { getHealthStatus } from "../services/health.service";

// Controller to return API health status
export const healthCheck = (_req: Request, res: Response) => {
  const data = getHealthStatus();
  res.status(200).json({ success: true, data });
};
