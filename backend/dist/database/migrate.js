"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pool_1 = require("./pool");
const logger_1 = require("../utils/logger");
const migrationsDir = path_1.default.join(__dirname, "migrations");
// Create the migrations tracking table if it does not exist
const ensureMigrationsTable = async () => {
    await pool_1.db.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
};
const getAppliedMigrations = async () => {
    const result = await pool_1.db.query("SELECT name FROM schema_migrations ORDER BY name ASC");
    return new Set(result.rows.map((row) => row.name));
};
const loadMigrationFiles = () => {
    if (!fs_1.default.existsSync(migrationsDir)) {
        return [];
    }
    return fs_1.default
        .readdirSync(migrationsDir)
        .filter((file) => file.endsWith(".sql"))
        .sort();
};
const applyMigration = async (filename) => {
    const fullPath = path_1.default.join(migrationsDir, filename);
    const sql = fs_1.default.readFileSync(fullPath, "utf-8");
    const pool = (0, pool_1.getPool)();
    await pool.query("BEGIN");
    try {
        await pool.query(sql);
        await pool.query("INSERT INTO schema_migrations (name) VALUES ($1)", [filename]);
        await pool.query("COMMIT");
        logger_1.logger.info(`Applied migration: ${filename}`);
    }
    catch (error) {
        await pool.query("ROLLBACK");
        logger_1.logger.error(`Migration failed: ${filename}`, error);
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
        }
        else {
            logger_1.logger.info(`Skipping already applied migration: ${file}`);
        }
    }
    logger_1.logger.info("Database migrations complete.");
};
runMigrations()
    .then(() => process.exit(0))
    .catch((error) => {
    logger_1.logger.error("Migration run failed:", error);
    process.exit(1);
});
