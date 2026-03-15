import { Router } from "express";
import { placeOrder, summary } from "../controllers/checkout.controller";
import { authMiddleware } from "../middleware";
import { validateRequest } from "../middleware/validateRequest";
import { checkoutSchema } from "../validators/checkout.schemas";

const router = Router();

router.get("/summary", authMiddleware, summary);
router.post("/", authMiddleware, validateRequest(checkoutSchema), placeOrder);

export default router;
