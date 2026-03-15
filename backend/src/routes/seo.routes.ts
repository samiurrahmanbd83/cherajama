import { Router } from "express";
import { getSeo, getSite, sitemap, upsertEntitySeo, upsertSite } from "../controllers/seo.controller";
import { adminMiddleware } from "../middleware";
import { validateRequest } from "../middleware/validateRequest";
import {
  seoEntitySchema,
  seoSiteUpsertSchema,
  upsertSeoEntitySchema
} from "../validators/seo.schemas";

const router = Router();

router.get("/sitemap.xml", sitemap);
router.get("/site", getSite);
router.get("/:entity_type/:entity_id", validateRequest(seoEntitySchema), getSeo);

router.put("/site", ...adminMiddleware, validateRequest(seoSiteUpsertSchema), upsertSite);
router.put(
  "/:entity_type/:entity_id",
  ...adminMiddleware,
  validateRequest(upsertSeoEntitySchema),
  upsertEntitySeo
);

export default router;
