import express from "express";
import path from "path";
import morgan from "morgan";
import cors from "cors";
import routes from "./routes";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import {
  rateLimiter,
  securityHeaders,
  sqlInjectionGuard,
  xssProtection
} from "./middleware";

// Express application instance and middleware pipeline
const app = express();

app.use(securityHeaders);
// Allow all origins for API access.
app.use(cors({ origin: "*" }));
// Explicitly respond to preflight requests.
app.options(/.*/, cors({ origin: "*" }));
app.use(rateLimiter);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(xssProtection);
app.use(sqlInjectionGuard);
app.use(morgan("combined"));
app.use("/uploads", express.static(path.resolve(process.cwd(), "..", "uploads")));

// Base API routes
app.use("/api", routes);

// 404 and error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
