import { Router } from "express";
import { getActive, getBySlug } from "../controllers/homepage.controller";
import { validateRequest } from "../middleware/validateRequest";
import { homepageSlugSchema } from "../validators/homepage.schemas";

const router = Router();

router.get("/", getActive);
router.get("/:slug", validateRequest(homepageSlugSchema), getBySlug);

export default router;
