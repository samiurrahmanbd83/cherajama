import { Router } from "express";
import { login, profile, register, updateProfileHandler } from "../controllers/auth.controller";
import { authenticate } from "../middleware";
import { validateRequest } from "../middleware/validateRequest";
import { loginSchema, registerSchema, updateProfileSchema } from "../validators/auth.schemas";

// Authentication routes
const router = Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.get("/profile", authenticate, profile);
router.put("/profile", authenticate, validateRequest(updateProfileSchema), updateProfileHandler);

export default router;
