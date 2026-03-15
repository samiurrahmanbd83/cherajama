import { Router } from "express";
import { list, listEnabled, update } from "../controllers/marketing.controller";
import { adminMiddleware } from "../middleware";
import { validateRequest } from "../middleware/validateRequest";
import { marketingProviderSchema, updateMarketingSchema } from "../validators/marketing.schemas";

const router = Router();

router.get("/public", listEnabled);
router.get("/", ...adminMiddleware, list);
router.put(
  "/:provider",
  ...adminMiddleware,
  validateRequest(updateMarketingSchema),
  update
);

export default router;
