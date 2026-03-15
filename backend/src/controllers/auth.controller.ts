import type { Request, Response } from "express";
import {
  getProfile,
  loginUser,
  registerUser,
  updateProfile
} from "../services/auth.service";

// Register a new user
export const register = async (req: Request, res: Response) => {
  const { user, token } = await registerUser(req.body);
  res.status(201).json({ success: true, data: { user, token } });
};

// Authenticate and issue a JWT
export const login = async (req: Request, res: Response) => {
  const { user, token } = await loginUser(req.body);
  res.status(200).json({ success: true, data: { user, token } });
};

// Return current user's profile
export const profile = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authenticated." });
  }

  const user = await getProfile(req.user.id);
  return res.status(200).json({ success: true, data: { user } });
};

// Update current user's profile
export const updateProfileHandler = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authenticated." });
  }

  const user = await updateProfile(req.user.id, req.body);
  return res.status(200).json({ success: true, data: { user } });
};
