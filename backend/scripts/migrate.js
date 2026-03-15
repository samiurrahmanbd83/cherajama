const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is required to connect to PostgreSQL");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

const migrationsDir = path.join(__dirname, "..", "src", "database", "migrations");

const ensureMigrationsTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
};

const getAppliedMigrations = async () => {
  const result = await pool.query("SELECT name FROM schema_migrations ORDER BY name ASC");
  return new Set(result.rows.map((row) => row.name));
};

const loadMigrationFiles = () => {
  if (!fs.existsSync(migrationsDir)) return [];
  return fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();
};

const applyMigration = async (filename) => {
  const fullPath = path.join(migrationsDir, filename);
  const sql = fs.readFileSync(fullPath, "utf8");

  await pool.query("BEGIN");
  try {
    await pool.query(sql);
    await pool.query("INSERT INTO schema_migrations (name) VALUES ($1)", [filename]);
    await pool.query("COMMIT");
    console.log(`Applied migration: ${filename}`);
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error(`Migration failed: ${filename}`);
    throw error;
  }
};

const run = async () => {
  await ensureMigrationsTable();
  const applied = await getAppliedMigrations();
  const files = loadMigrationFiles();

  for (const file of files) {
    if (!applied.has(file)) {
      await applyMigration(file);
    } else {
      console.log(`Skipping already applied migration: ${file}`);
    }
  }

  console.log("Database migrations complete.");
};

run()
  .then(() => pool.end())
  .catch((error) => {
    console.error("Migration run failed:", error);
    pool.end().finally(() => process.exit(1));
  });
