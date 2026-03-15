"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const notFound_1 = require("./middleware/notFound");
const middleware_1 = require("./middleware");
// Express application instance and middleware pipeline
const app = (0, express_1.default)();
app.use(middleware_1.securityHeaders);
// Allow all origins for API access.
app.use((0, cors_1.default)({ origin: "*" }));
// Explicitly respond to preflight requests.
app.options(/.*/, (0, cors_1.default)({ origin: "*" }));
app.use(middleware_1.rateLimiter);
app.use(express_1.default.json({ limit: "1mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(middleware_1.xssProtection);
app.use(middleware_1.sqlInjectionGuard);
app.use((0, morgan_1.default)("combined"));
app.use("/uploads", express_1.default.static(path_1.default.resolve(process.cwd(), "..", "uploads")));
// Base API routes
app.use("/api", routes_1.default);
// 404 and error handlers
app.use(notFound_1.notFound);
app.use(errorHandler_1.errorHandler);
exports.default = app;
