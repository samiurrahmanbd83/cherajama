import { supabase } from "../database/supabase";
import { AppError } from "../utils/AppError";
import { checkout } from "./checkout.service";

export const createOrderFromCart = async (userId: string, input: {
  name: string;
  phone: string;
  email: string;
  shipping_address: string;
  city: string;
  postal_code: string;
}) => {
  return checkout(userId, input);
};

export const listOrders = async (userId: string, role: string) => {
  const query = supabase.from("orders").select("*").order("created_at", { ascending: false });

  const { data, error } =
    role === "admin" || role === "staff"
      ? await query
      : await query.eq("user_id", userId);

  if (error) {
    throw new AppError(error.message, 500);
  }

  return data || [];
};

export const getOrderById = async (userId: string, role: string, id: string) => {
  const base = supabase.from("orders").select("*").eq("id", id);
  const { data, error } =
    role === "admin" || role === "staff" ? await base.maybeSingle() : await base.eq("user_id", userId).maybeSingle();

  if (error) {
    throw new AppError(error.message, 500);
  }
  if (!data) {
    throw new AppError("Order not found.", 404);
  }
  return data;
};

export const cancelOrder = async (userId: string, role: string, id: string) => {
  const order = await getOrderById(userId, role, id);

  const { data, error } = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", order.id)
    .select("*")
    .single();

  if (error) {
    throw new AppError(error.message, 500);
  }
  return data;
};

export const updateOrderStatus = async (id: string, status: string) => {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new AppError(error.message, 500);
  }
  return data;
};
