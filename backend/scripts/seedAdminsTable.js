const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is required to connect to PostgreSQL");
  process.exit(1);
}

const pool = new Pool({ connectionString });

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL || "admin_cherajama@gmail.com";
  const password = process.env.ADMIN_PASSWORD || "Cherajama485";
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12);

  const passwordHash = await bcrypt.hash(password, saltRounds);

  await pool.query(
    `INSERT INTO admins (email, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (email)
     DO UPDATE SET password_hash = EXCLUDED.password_hash, updated_at = NOW()`,
    [email, passwordHash]
  );

  console.log("Admin seed complete.");
  console.log(`Email: ${email}`);
};

seedAdmin()
  .catch((error) => {
    console.error("Failed to seed admin:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
