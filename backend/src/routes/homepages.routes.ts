import { Router } from "express";
import {
  create,
  createSectionItem,
  getById,
  list,
  listSectionItems,
  remove,
  removeSectionItem,
  reorderSectionItems,
  update,
  updateSectionItem
} from "../controllers/homepage.controller";
import { adminMiddleware } from "../middleware";
import { validateRequest } from "../middleware/validateRequest";
import {
  createHomepageSchema,
  createSectionSchema,
  homepageIdSchema,
  reorderSectionsSchema,
  sectionIdSchema,
  updateHomepageSchema,
  updateSectionSchema
} from "../validators/homepage.schemas";

const router = Router();

router.get("/", ...adminMiddleware, list);
router.get("/:id", ...adminMiddleware, validateRequest(homepageIdSchema), getById);
router.post("/", ...adminMiddleware, validateRequest(createHomepageSchema), create);
router.put("/:id", ...adminMiddleware, validateRequest(updateHomepageSchema), update);
router.delete("/:id", ...adminMiddleware, validateRequest(homepageIdSchema), remove);

router.get(
  "/:id/sections",
  ...adminMiddleware,
  validateRequest(homepageIdSchema),
  listSectionItems
);

router.post(
  "/:id/sections",
  ...adminMiddleware,
  validateRequest(createSectionSchema),
  createSectionItem
);

router.put(
  "/sections/:sectionId",
  ...adminMiddleware,
  validateRequest(updateSectionSchema),
  updateSectionItem
);

router.delete(
  "/sections/:sectionId",
  ...adminMiddleware,
  validateRequest(sectionIdSchema),
  removeSectionItem
);

router.put(
  "/:id/sections/reorder",
  ...adminMiddleware,
  validateRequest(reorderSectionsSchema),
  reorderSectionItems
);

export default router;
