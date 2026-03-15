import { Router } from "express";
import { list, remove, upload } from "../controllers/media.controller";
import { mediaUpload, staffMiddleware } from "../middleware";
import { validateRequest } from "../middleware/validateRequest";
import { mediaIdSchema, mediaListSchema } from "../validators/media.schemas";

const router = Router();

router.get("/", ...staffMiddleware, validateRequest(mediaListSchema), list);
router.post("/upload", ...staffMiddleware, mediaUpload.array("media", 10), upload);
router.delete("/:id", ...staffMiddleware, validateRequest(mediaIdSchema), remove);

export default router;
