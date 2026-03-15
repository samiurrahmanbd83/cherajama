import bcrypt from "bcrypt";
import { env } from "../config/env";

// Hash a plaintext password
export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
};

// Compare a plaintext password with a stored hash
export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
