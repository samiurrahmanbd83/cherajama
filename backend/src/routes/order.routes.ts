import { Router } from "express";
import { cancel, create, history, track, updateStatus } from "../controllers/order.controller";
import { adminMiddleware, authMiddleware } from "../middleware";
import { validateRequest } from "../middleware/validateRequest";
import { createOrderSchema, orderIdSchema, updateOrderStatusSchema } from "../validators/order.schemas";

const router = Router();

router.post("/", authMiddleware, validateRequest(createOrderSchema), create);
router.get("/", authMiddleware, history);
router.get("/:id", authMiddleware, validateRequest(orderIdSchema), track);
router.put("/:id/cancel", authMiddleware, validateRequest(orderIdSchema), cancel);
router.put(
  "/:id/status",
  ...adminMiddleware,
  validateRequest(updateOrderStatusSchema),
  updateStatus
);

export default router;
