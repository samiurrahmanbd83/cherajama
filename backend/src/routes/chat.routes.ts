import { Router } from "express";
import { getChatSettings, updateChatSettings } from "../controllers/chat.controller";
import { adminMiddleware } from "../middleware";
import { validateRequest } from "../middleware/validateRequest";
import { updateChatButtonsSchema } from "../validators/chat.schemas";

const router = Router();

router.get("/", getChatSettings);
router.put("/", ...adminMiddleware, validateRequest(updateChatButtonsSchema), updateChatSettings);

export default router;
