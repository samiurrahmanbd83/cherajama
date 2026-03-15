import type { Request, Response } from "express";
import { deleteUser, listUsers, updateUserRole } from "../services/adminUsers.service";
import { getParam } from "../utils/request";

export const list = async (req: Request, res: Response) => {
  const users = await listUsers(req.query as any);
  res.status(200).json({ success: true, data: { users } });
};

export const updateRole = async (req: Request, res: Response) => {
  const user = await updateUserRole(getParam(req.params, "id"), req.body.role);
  res.status(200).json({ success: true, data: { user } });
};

export const remove = async (req: Request, res: Response) => {
  const result = await deleteUser(getParam(req.params, "id"));
  res.status(200).json({ success: true, data: result });
};

