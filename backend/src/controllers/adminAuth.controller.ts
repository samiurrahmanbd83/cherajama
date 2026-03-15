import type { Request, Response } from "express";
import { loginAdmin } from "../services/adminAuth.service";

// Admin login
export const login = async (req: Request, res: Response) => {
  const result = await loginAdmin(req.body);
  res.status(200).json({ success: true, data: result });
};
