"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
// Load environment variables from .env into process.env
dotenv_1.default.config();
// Validate and coerce environment variables to safe runtime values
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "test", "production"]).default("development"),
    PORT: zod_1.z.coerce.number().int().positive().default(5000),
    CORS_ORIGIN: zod_1.z.string().default("*"),
    RATE_LIMIT_WINDOW_MS: zod_1.z.coerce.number().int().positive().default(15 * 60 * 1000),
    RATE_LIMIT_MAX: zod_1.z.coerce.number().int().positive().default(100),
    JWT_SECRET: zod_1.z
        .string()
        .min(32)
        .default("replace_me_with_a_strong_secret_change_me"),
    JWT_EXPIRES_IN: zod_1.z.string().default("7d"),
    BCRYPT_SALT_ROUNDS: zod_1.z.coerce.number().int().positive().default(12),
    TAX_RATE: zod_1.z.coerce.number().min(0).max(1).default(0.07),
    SHIPPING_FLAT_RATE: zod_1.z.coerce.number().min(0).default(5),
    LOG_LEVEL: zod_1.z.string().default("info"),
    SITE_URL: zod_1.z.string().default("http://localhost:3000"),
    // Supabase
    SUPABASE_URL: zod_1.z.string().optional(),
    SUPABASE_SERVICE_ROLE_KEY: zod_1.z.string().optional(),
    // Cloudinary (legacy image uploads)
    CLOUDINARY_CLOUD_NAME: zod_1.z.string().optional(),
    CLOUDINARY_API_KEY: zod_1.z.string().optional(),
    CLOUDINARY_API_SECRET: zod_1.z.string().optional(),
    // Optional Postgres connection (legacy)
    DATABASE_URL: zod_1.z.string().min(1).optional()
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    const details = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
    throw new Error(`Invalid environment variables: ${details}`);
}
exports.env = parsed.data;
