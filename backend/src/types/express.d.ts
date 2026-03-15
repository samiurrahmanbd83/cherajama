import "express";

// Extend Express Request to include authenticated user context
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: "admin" | "staff" | "customer";
      };
    }
  }
}
