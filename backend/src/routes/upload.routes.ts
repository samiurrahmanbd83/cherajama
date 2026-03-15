import { Router } from "express";
import { uploadImage } from "../controllers/upload.controller";
import { productImageUpload, validateRequest } from "../middleware";
import { uploadImageSchema } from "../validators/upload.schemas";

const router = Router();

// Image uploads (Supabase Storage)
router.post("/", productImageUpload.single("file"), validateRequest(uploadImageSchema), uploadImage);

export default router;
