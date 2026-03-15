import { authenticate } from "./authenticate";
import { requireRole } from "./requireRole";

// Restrict access to staff and admin users
export const staffMiddleware = [authenticate, requireRole(["admin", "staff"])];
