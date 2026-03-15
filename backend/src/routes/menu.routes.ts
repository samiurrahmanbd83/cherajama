import { Router } from "express";
import {
  addItem,
  create,
  getBySlug,
  list,
  remove,
  removeItem,
  reorder,
  update,
  updateItem
} from "../controllers/menu.controller";
import { adminMiddleware } from "../middleware";
import { validateRequest } from "../middleware/validateRequest";
import {
  createMenuItemSchema,
  createMenuSchema,
  menuIdSchema,
  menuItemIdSchema,
  menuSlugSchema,
  reorderMenuItemsSchema,
  updateMenuItemSchema,
  updateMenuSchema
} from "../validators/menu.schemas";

const router = Router();

router.get("/", list);
router.get("/:slug", validateRequest(menuSlugSchema), getBySlug);

router.post("/", ...adminMiddleware, validateRequest(createMenuSchema), create);
router.put("/:id", ...adminMiddleware, validateRequest(updateMenuSchema), update);
router.delete("/:id", ...adminMiddleware, validateRequest(menuIdSchema), remove);

router.post(
  "/:id/items",
  ...adminMiddleware,
  validateRequest(createMenuItemSchema),
  addItem
);

router.put(
  "/items/:itemId",
  ...adminMiddleware,
  validateRequest(updateMenuItemSchema),
  updateItem
);

router.delete(
  "/items/:itemId",
  ...adminMiddleware,
  validateRequest(menuItemIdSchema),
  removeItem
);

router.put(
  "/:id/items/reorder",
  ...adminMiddleware,
  validateRequest(reorderMenuItemsSchema),
  reorder
);

export default router;
