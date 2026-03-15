import { Router } from "express";
import {
  createSection,
  deleteSection,
  updateSection
} from "../controllers/homepageSections.controller";
import { validateRequest } from "../middleware/validateRequest";
import {
  createHomepageSectionSchema,
  deleteHomepageSectionSchema,
  updateHomepageSectionSchema
} from "../validators/homepageSections.schemas";

const router = Router();

router.post("/", validateRequest(createHomepageSectionSchema), createSection);
router.put("/:id", validateRequest(updateHomepageSectionSchema), updateSection);
router.delete("/:id", validateRequest(deleteHomepageSectionSchema), deleteSection);

export default router;
