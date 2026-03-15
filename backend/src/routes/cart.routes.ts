import { Router } from "express";
import { addItem, removeItem, updateItem, viewCart } from "../controllers/cart.controller";
import { authMiddleware } from "../middleware";
import { validateRequest } from "../middleware/validateRequest";
import { addToCartSchema, removeCartItemSchema, updateCartItemSchema } from "../validators/cart.schemas";

const router = Router();

router.get("/", authMiddleware, viewCart);
router.post("/", authMiddleware, validateRequest(addToCartSchema), addItem);
router.put("/:id", authMiddleware, validateRequest(updateCartItemSchema), updateItem);
router.delete("/:id", authMiddleware, validateRequest(removeCartItemSchema), removeItem);

export default router;
