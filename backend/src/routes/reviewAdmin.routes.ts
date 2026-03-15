import { Router } from "express";
import { list, updateApproval } from "../controllers/reviewAdmin.controller";
import { validateRequest } from "../middleware/validateRequest";
import { reviewAdminListSchema, reviewAdminUpdateSchema } from "../validators/reviewAdmin.schemas";

const router = Router();

router.get("/", validateRequest(reviewAdminListSchema), list);
router.put("/:id", validateRequest(reviewAdminUpdateSchema), updateApproval);

export default router;
