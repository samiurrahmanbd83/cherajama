import { Router } from "express";
import { create, getLatest, toggle, update } from "../controllers/announcement.controller";
import { adminMiddleware } from "../middleware";
import { validateRequest } from "../middleware/validateRequest";
import {
  createAnnouncementSchema,
  toggleAnnouncementSchema,
  updateAnnouncementSchema
} from "../validators/announcement.schemas";

const router = Router();

router.get("/", getLatest);
router.post("/", ...adminMiddleware, validateRequest(createAnnouncementSchema), create);
router.put(
  "/:id",
  ...adminMiddleware,
  validateRequest(updateAnnouncementSchema),
  update
);
router.put(
  "/toggle",
  ...adminMiddleware,
  validateRequest(toggleAnnouncementSchema),
  toggle
);

export default router;
