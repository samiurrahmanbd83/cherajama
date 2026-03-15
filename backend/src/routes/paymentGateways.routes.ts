import { Router } from "express";
import { list, toggle, update } from "../controllers/paymentGateways.controller";
import { adminMiddleware } from "../middleware";
import { validateRequest } from "../middleware/validateRequest";
import { toggleGatewaySchema, updateGatewaySchema } from "../validators/paymentGateways.schemas";

const router = Router();

router.get("/", list);
router.put("/:id/toggle", ...adminMiddleware, validateRequest(toggleGatewaySchema), toggle);
router.put("/:id", ...adminMiddleware, validateRequest(updateGatewaySchema), update);

export default router;
