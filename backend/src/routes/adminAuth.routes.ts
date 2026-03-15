import { Router } from "express";
import { login } from "../controllers/adminAuth.controller";
import { validateRequest } from "../middleware/validateRequest";
import { adminLoginSchema } from "../validators/adminAuth.schemas";

const router = Router();

router.post("/login", validateRequest(adminLoginSchema), login);

export default router;
