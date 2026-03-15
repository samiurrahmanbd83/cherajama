import { Router } from "express";
import { create, list, remove, update } from "../controllers/category.controller";
import { adminMiddleware } from "../middleware";
import { validateRequest } from "../middleware/validateRequest";
import {
  categoryIdSchema,
  createCategorySchema,
  updateCategorySchema
} from "../validators/category.schemas";

const router = Router();

router.get("/", list);

router.post(
  "/",
  ...adminMiddleware,
  validateRequest(createCategorySchema),
  create
);

router.put(
  "/:id",
  ...adminMiddleware,
  validateRequest(updateCategorySchema),
  update
);

router.delete(
  "/:id",
  ...adminMiddleware,
  validateRequest(categoryIdSchema),
  remove
);

export default router;
