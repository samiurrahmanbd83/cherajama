import { supabase } from "../database/supabase";
import { AppError } from "../utils/AppError";

export const listUsers = async (_query: Record<string, any>) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, first_name, last_name, email, role, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new AppError(error.message, 500);
  }

  return data || [];
};

export const updateUserRole = async (id: string, role: "admin" | "staff" | "customer") => {
  const { data, error } = await supabase
    .from("users")
    .update({ role })
    .eq("id", id)
    .select("id, first_name, last_name, email, role, created_at")
    .single();

  if (error) {
    throw new AppError(error.message, 500);
  }

  return data;
};

export const deleteUser = async (id: string) => {
  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) {
    throw new AppError(error.message, 500);
  }
  return { id };
};
