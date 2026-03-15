import { supabase } from "../database/supabase";
import { AppError } from "../utils/AppError";
import { comparePassword, hashPassword } from "../utils/password";
import { signToken } from "../utils/jwt";

type UserRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  password_hash: string;
  role: "admin" | "staff" | "customer";
  is_active: boolean | null;
};

const mapUser = (row: UserRow) => ({
  id: row.id,
  firstName: row.first_name || "",
  lastName: row.last_name || "",
  email: row.email,
  role: row.role
});

export const registerUser = async (input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const { data: existing, error: existingError } = await supabase
    .from("users")
    .select("id")
    .eq("email", input.email)
    .maybeSingle();

  if (existingError) {
    throw new AppError(existingError.message, 500);
  }
  if (existing) {
    throw new AppError("Email already registered.", 409);
  }

  const passwordHash = await hashPassword(input.password);

  const { data, error } = await supabase
    .from("users")
    .insert({
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      password_hash: passwordHash,
      role: "customer",
      is_active: true
    })
    .select("*")
    .single();

  if (error) {
    throw new AppError(error.message, 500);
  }

  const user = mapUser(data as UserRow);
  const token = signToken({
    sub: user.id,
    email: user.email,
    role: user.role
  });

  return { user, token };
};

export const loginUser = async (input: { email: string; password: string }) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", input.email)
    .maybeSingle();

  if (error) {
    throw new AppError(error.message, 500);
  }
  if (!data || data.is_active === false) {
    throw new AppError("Invalid credentials.", 401);
  }

  const valid = await comparePassword(input.password, data.password_hash);
  if (!valid) {
    throw new AppError("Invalid credentials.", 401);
  }

  const user = mapUser(data as UserRow);
  const token = signToken({
    sub: user.id,
    email: user.email,
    role: user.role
  });

  return { user, token };
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new AppError(error.message, 500);
  }
  if (!data) {
    throw new AppError("User not found.", 404);
  }

  return mapUser(data as UserRow);
};

export const updateProfile = async (
  userId: string,
  input: { firstName?: string; lastName?: string; email?: string; password?: string }
) => {
  const payload: Record<string, any> = {};
  if (input.firstName !== undefined) payload.first_name = input.firstName;
  if (input.lastName !== undefined) payload.last_name = input.lastName;
  if (input.email !== undefined) payload.email = input.email;
  if (input.password) {
    payload.password_hash = await hashPassword(input.password);
  }

  const { data, error } = await supabase
    .from("users")
    .update(payload)
    .eq("id", userId)
    .select("*")
    .single();

  if (error) {
    throw new AppError(error.message, 500);
  }

  return mapUser(data as UserRow);
};
