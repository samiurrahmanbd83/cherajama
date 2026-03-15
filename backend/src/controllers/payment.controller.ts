import type { Request, Response } from "express";
import { getParam } from "../utils/request";
import {
  createDispute,
  getPaymentAnalytics,
  getRiskReport,
  listDisputes,
  listPaymentLogs,
  listPayments,
  listPendingPayments,
  rejectPayment,
  submitPayment,
  updateDisputeStatus,
  verifyPayment
} from "../services/payment.service";

// Customer submits payment details
export const submit = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await submitPayment(userId, req.body);
  res.status(200).json({ success: true, data: { payment: result } });
};

// Admin views all payments
export const listAll = async (req: Request, res: Response) => {
  const payments = await listPayments(req.query as any);
  res.status(200).json({ success: true, data: { payments } });
};

// Admin views pending payments
export const pending = async (_req: Request, res: Response) => {
  const payments = await listPendingPayments();
  res.status(200).json({ success: true, data: { payments } });
};

// Admin views payment logs
export const logs = async (req: Request, res: Response) => {
  const records = await listPaymentLogs(req.query.order_id as string | undefined);
  res.status(200).json({ success: true, data: { logs: records } });
};

// Admin risk report
export const riskReport = async (req: Request, res: Response) => {
  const payments = await getRiskReport(req.query.level as string | undefined);
  res.status(200).json({ success: true, data: { payments } });
};

// Admin approves payment
export const approve = async (req: Request, res: Response) => {
  const payment = await verifyPayment(getParam(req.params, "order_id"));
  res.status(200).json({ success: true, data: { payment } });
};

// Admin rejects payment
export const reject = async (req: Request, res: Response) => {
  const payment = await rejectPayment(getParam(req.params, "order_id"));
  res.status(200).json({ success: true, data: { payment } });
};

// Customer submits dispute
export const dispute = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const record = await createDispute(userId, req.body);
  res.status(201).json({ success: true, data: { dispute: record } });
};

// Admin list disputes
export const listDisputesAdmin = async (_req: Request, res: Response) => {
  const disputes = await listDisputes();
  res.status(200).json({ success: true, data: { disputes } });
};

// Admin update dispute
export const updateDispute = async (req: Request, res: Response) => {
  const dispute = await updateDisputeStatus(getParam(req.params, "id"), req.body.status);
  res.status(200).json({ success: true, data: { dispute } });
};

// Payment analytics
export const analytics = async (req: Request, res: Response) => {
  const days = Number(req.query.days || 30);
  const report = await getPaymentAnalytics(days);
  res.status(200).json({ success: true, data: { report } });
};

