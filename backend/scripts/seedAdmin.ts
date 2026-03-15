import crypto from "crypto";
import dotenv from "dotenv";
import { db, closePool } from "../src/database/pool";
import { hashPassword } from "../src/utils/password";

// Load environment variables
dotenv.config();

const getEnv = (key: string, fallback?: string) => process.env[key] || fallback;

const seedAdmin = async () => {
  const email = getEnv("ADMIN_EMAIL", "admin@cherajama.com") as string;
  const firstName = getEnv("ADMIN_FIRST_NAME", "Admin") as string;
  const lastName = getEnv("ADMIN_LAST_NAME", "User") as string;

  const providedPassword = getEnv("ADMIN_PASSWORD");
  const generatedPassword = crypto.randomBytes(24).toString("base64url");
  const password = providedPassword || generatedPassword;

  const passwordHash = await hashPassword(password);

  const existing = await db.query("SELECT id FROM users WHERE email = $1", [email]);

  if (existing.rows[0]) {
    await db.query(
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
    await db.query(
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
    await closePool();
  });
