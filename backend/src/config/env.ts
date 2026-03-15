import dotenv from "dotenv";
import { z } from "zod";

// Load environment variables from .env into process.env
dotenv.config();

// Validate and coerce environment variables to safe runtime values
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  CORS_ORIGIN: z.string().default("*"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  JWT_SECRET: z
    .string()
    .min(32)
    .default("replace_me_with_a_strong_secret_change_me"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().positive().default(12),
  TAX_RATE: z.coerce.number().min(0).max(1).default(0.07),
  SHIPPING_FLAT_RATE: z.coerce.number().min(0).default(5),
  LOG_LEVEL: z.string().default("info"),
  SITE_URL: z.string().default("http://localhost:3000"),
  // Supabase
  SUPABASE_URL: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  // Cloudinary (legacy image uploads)
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  // Optional Postgres connection (legacy)
  DATABASE_URL: z.string().min(1).optional()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join(", ");
  throw new Error(`Invalid environment variables: ${details}`);
}

export const env = parsed.data;
