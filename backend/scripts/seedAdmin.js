const crypto = require("crypto");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
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

const getEnv = (key, fallback) => process.env[key] || fallback;

const seedAdmin = async () => {
  const email = getEnv("ADMIN_EMAIL", "admin@cherajama.com");
  const firstName = getEnv("ADMIN_FIRST_NAME", "Admin");
  const lastName = getEnv("ADMIN_LAST_NAME", "User");
  const saltRounds = Number(getEnv("BCRYPT_SALT_ROUNDS", "12"));

  const providedPassword = getEnv("ADMIN_PASSWORD");
  const generatedPassword = crypto.randomBytes(24).toString("base64url");
  const password = providedPassword || generatedPassword;

  const passwordHash = await bcrypt.hash(password, saltRounds);

  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);

  if (existing.rows[0]) {
    await pool.query(
      `UPDATE users
       SET role = $1,
           first_name = $2,
           last_name = $3,
           password_hash = $4,
           is_active = TRUE,
           updated_at = NOW()
       WHERE email = $5`,
      ["admin", firstName, lastName, passwordHash, email]
    );
  } else {
    await pool.query(
      `INSERT INTO users (first_name, last_name, email, password_hash, role, is_active)
       VALUES ($1, $2, $3, $4, $5, TRUE)`,
      [firstName, lastName, email, passwordHash, "admin"]
    );
  }

  console.log("Admin account ready.");
  console.log(`Email: ${email}`);
  if (!providedPassword) {
    console.log("Generated password (save this):", password);
  } else {
    console.log("Password: (from ADMIN_PASSWORD env)");
  }
};

seedAdmin()
  .catch((error) => {
    console.error("Failed to seed admin:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
