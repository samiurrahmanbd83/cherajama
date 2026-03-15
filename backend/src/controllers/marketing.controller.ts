import type { Request, Response } from "express";
import { listEnabledIntegrations, listIntegrations, upsertIntegration } from "../services/marketing.service";
import { getParam } from "../utils/request";

// Admin: list all integrations
export const list = async (_req: Request, res: Response) => {
  const integrations = await listIntegrations();
  res.status(200).json({ success: true, data: { integrations } });
};

// Admin: update integration settings
export const update = async (req: Request, res: Response) => {
  const integration = await upsertIntegration(getParam(req.params, "provider") as any, req.body);
  res.status(200).json({ success: true, data: { integration } });
};

// Public: list enabled integrations
export const listEnabled = async (_req: Request, res: Response) => {
  const integrations = await listEnabledIntegrations();
  res.status(200).json({ success: true, data: { integrations } });
};

