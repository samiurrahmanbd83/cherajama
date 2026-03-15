import { env } from "../config/env";
// Resolve database configuration at runtime (optional)
export const getDatabaseConfig = () => {
  if (!env.DATABASE_URL) {
    return null;
  }

  return {
    connectionString: env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
  };
};
