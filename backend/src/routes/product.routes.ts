import { Router } from "express";
import { create, getBySlug, list, remove, search, update } from "../controllers/product.controller";
import { create as createReview, list as listReviews } from "../controllers/review.controller";
import { adminMiddleware, authMiddleware } from "../middleware";
import { validateRequest } from "../middleware/validateRequest";
import {
  createProductSchema,
  productIdSchema,
  productSearchSchema,
  productSlugSchema,
  updateProductSchema
} from "../validators/product.schemas";
import { createReviewSchema, reviewProductIdSchema } from "../validators/review.schemas";

const router = Router();

router.get("/", list);
router.get("/search", validateRequest(productSearchSchema), search);
router.get("/:id/reviews", validateRequest(reviewProductIdSchema), listReviews);
router.post(
  "/:id/reviews",
  authMiddleware,
  validateRequest(createReviewSchema),
  createReview
);
router.get("/:slug", validateRequest(productSlugSchema), getBySlug);

router.post(
  "/",
  ...adminMiddleware,
  validateRequest(createProductSchema),
  create
);

router.put(
  "/:id",
  ...adminMiddleware,
  validateRequest(updateProductSchema),
  update
);

router.delete(
  "/:id",
  ...adminMiddleware,
  validateRequest(productIdSchema),
  remove
);

export default router;
