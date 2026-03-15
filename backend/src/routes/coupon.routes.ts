import { Router } from "express";
import { create, list, remove, update } from "../controllers/coupon.controller";
import { adminMiddleware } from "../middleware";
import { validateRequest } from "../middleware/validateRequest";
import { couponIdSchema, createCouponSchema, updateCouponSchema } from "../validators/coupon.schemas";

const router = Router();

router.get("/", ...adminMiddleware, list);
router.post("/", ...adminMiddleware, validateRequest(createCouponSchema), create);
router.put("/:id", ...adminMiddleware, validateRequest(updateCouponSchema), update);
router.delete("/:id", ...adminMiddleware, validateRequest(couponIdSchema), remove);

export default router;
