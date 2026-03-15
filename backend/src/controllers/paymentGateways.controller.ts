import type { Request, Response } from "express";
import { listGateways, toggleGateway, updateGateway } from "../services/paymentGateways.service";
import { getParam } from "../utils/request";

// List payment gateways
export const list = async (_req: Request, res: Response) => {
  const gateways = await listGateways();
  res.status(200).json({ success: true, data: { gateways } });
};

// Toggle gateway
export const toggle = async (req: Request, res: Response) => {
  const gateway = await toggleGateway(getParam(req.params, "id"), req.body.is_active);
  res.status(200).json({ success: true, data: { gateway } });
};

// Update gateway settings
export const update = async (req: Request, res: Response) => {
  const gateway = await updateGateway(getParam(req.params, "id"), req.body);
  res.status(200).json({ success: true, data: { gateway } });
};

