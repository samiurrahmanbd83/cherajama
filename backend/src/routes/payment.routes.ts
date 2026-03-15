import { Router } from "express";
import {
  analytics,
  approve,
  dispute,
  listAll,
  listDisputesAdmin,
  logs,
  pending,
  reject,
  riskReport,
  submit,
  updateDispute
} from "../controllers/payment.controller";
import { adminMiddleware, authMiddleware } from "../middleware";
import { validateRequest } from "../middleware/validateRequest";
import {
  disputeStatusSchema,
  paymentAnalyticsQuerySchema,
  paymentDisputeSchema,
  paymentLogsQuerySchema,
  paymentOrderIdSchema,
  paymentRiskReportQuerySchema,
  paymentsQuerySchema,
  submitPaymentSchema
} from "../validators/payment.schemas";

const router = Router();

router.post("/submit", authMiddleware, validateRequest(submitPaymentSchema), submit);
router.get("/", ...adminMiddleware, validateRequest(paymentsQuerySchema), listAll);
router.get("/pending", ...adminMiddleware, pending);
router.get("/logs", ...adminMiddleware, validateRequest(paymentLogsQuerySchema), logs);
router.get("/risk-report", ...adminMiddleware, validateRequest(paymentRiskReportQuerySchema), riskReport);
router.get("/analytics", ...adminMiddleware, validateRequest(paymentAnalyticsQuerySchema), analytics);
router.post("/dispute", authMiddleware, validateRequest(paymentDisputeSchema), dispute);
router.get("/disputes", ...adminMiddleware, listDisputesAdmin);
router.put("/disputes/:id", ...adminMiddleware, validateRequest(disputeStatusSchema), updateDispute);
router.put("/verify/:order_id", ...adminMiddleware, validateRequest(paymentOrderIdSchema), approve);
router.put("/reject/:order_id", ...adminMiddleware, validateRequest(paymentOrderIdSchema), reject);

export default router;
