import { Router } from "express";
import { overview, revenue, sales, topProducts } from "../controllers/analytics.controller";
import { staffMiddleware } from "../middleware";
import { validateRequest } from "../middleware/validateRequest";
import { revenueSeriesSchema, salesSeriesSchema, topProductsSchema } from "../validators/analytics.schemas";

const router = Router();

router.get("/overview", ...staffMiddleware, overview);
router.get("/sales", ...staffMiddleware, validateRequest(salesSeriesSchema), sales);
router.get("/revenue", ...staffMiddleware, validateRequest(revenueSeriesSchema), revenue);
router.get("/top-products", ...staffMiddleware, validateRequest(topProductsSchema), topProducts);

export default router;
