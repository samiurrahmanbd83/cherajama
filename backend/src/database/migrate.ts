import fs from "fs";
import path from "path";
import { db, getPool } from "./pool";
import { logger } from "../utils/logger";

const migrationsDir = path.join(__dirname, "migrations");

// Create the migrations tracking table if it does not exist
const ensureMigrationsTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
};

const getAppliedMigrations = async () => {
  const result = await db.query<{ name: string }>(
    "SELECT name FROM schema_migrations ORDER BY name ASC"
  );
  return new Set(result.rows.map((row) => row.name));
};

const loadMigrationFiles = () => {
  if (!fs.existsSync(migrationsDir)) {
    return [] as string[];
  }

  return fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();
};

const applyMigration = async (filename: string) => {
  const fullPath = path.join(migrationsDir, filename);
  const sql = fs.readFileSync(fullPath, "utf-8");
  const pool = getPool();

  await pool.query("BEGIN");
  try {
    await pool.query(sql);
    await pool.query("INSERT INTO schema_migrations (name) VALUES ($1)", [filename]);
    await pool.query("COMMIT");
    logger.info(`Applied migration: ${filename}`);
  } catch (error) {
    await pool.query("ROLLBACK");
    logger.error(`Migration failed: ${filename}`, error);
    throw error;
  }
};

const runMigrations = async () => {
  await ensureMigrationsTable();
  const applied = await getAppliedMigrations();
  const files = loadMigrationFiles();

  for (const file of files) {
    if (!applied.has(file)) {
      await applyMigration(file);
    } else {
      logger.info(`Skipping already applied migration: ${file}`);
    }
  }

  logger.info("Database migrations complete.");
};

runMigrations()
  .then(() => process.exit(0))
  .catch((error) => {
    logger.error("Migration run failed:", error);
    process.exit(1);
  });
