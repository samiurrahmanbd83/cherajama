import { authenticate } from "./authenticate";
import { requireRole } from "./requireRole";

// Restrict access to admin users only
export const adminMiddleware = [authenticate, requireRole(["admin"])];
