import { Router } from "express";
import { healthCheck } from "../controllers/health.controller";

// Health route for uptime checks
const router = Router();

router.get("/", healthCheck);

export default router;
