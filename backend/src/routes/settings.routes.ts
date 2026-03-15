import { Router } from "express";
import { getWebsiteSettings, updateWebsiteSettings } from "../controllers/settings.controller";
import { adminMiddleware, settingsUpload } from "../middleware";
import { validateRequest } from "../middleware/validateRequest";
import { updateSettingsSchema } from "../validators/settings.schemas";

const router = Router();

router.get("/", getWebsiteSettings);
router.put(
  "/",
  ...adminMiddleware,
  settingsUpload.fields([
    { name: "logo", maxCount: 1 },
    { name: "favicon", maxCount: 1 }
  ]),
  validateRequest(updateSettingsSchema),
  updateWebsiteSettings
);

export default router;
