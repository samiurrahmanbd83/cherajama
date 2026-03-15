import { supabase } from "../database/supabase";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";

type CartItemRow = {
  id: string;
  product_id: string;
  quantity: number;
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  price: number;
};

const roundMoney = (value: number) => Math.round(value * 100) / 100;

export const getCheckoutSummary = async (userId: string) => {
  const { data: items, error } = await supabase
    .from("cart_items")
    .select("id, product_id, quantity")
    .eq("user_id", userId);

  if (error) {
    throw new AppError(error.message, 500);
  }

  if (!items || !items.length) {
    throw new AppError("Cart is empty.", 400);
  }

  const productIds = items.map((item: CartItemRow) => item.product_id);
  const { data: products, error: productError } = await supabase
    .from("products")
    .select("id, name, slug, price")
    .in("id", productIds);

  if (productError) {
    throw new AppError(productError.message, 500);
  }

  const productsById = (products || []).reduce(
    (acc: Record<string, ProductRow>, product: ProductRow) => {
      acc[product.id] = product;
      return acc;
    },
    {} as Record<string, ProductRow>
  );

  const enriched = items.map((item: CartItemRow) => {
    const product = productsById[item.product_id];
    const unit_price = Number(product?.price ?? 0);
    return {
      id: item.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price,
      name: product?.name ?? "",
      slug: product?.slug ?? ""
    };
  });

  const subtotal = enriched.reduce(
    (sum: number, item: { unit_price: number; quantity: number }) =>
      sum + Number(item.unit_price) * Number(item.quantity),
    0
  );

  const tax = roundMoney(subtotal * env.TAX_RATE);
  const shippingCost = roundMoney(env.SHIPPING_FLAT_RATE);
  const total = roundMoney(subtotal + tax + shippingCost);

  return {
    cart_id: userId,
    items: enriched,
    summary: {
      subtotal: roundMoney(subtotal),
      tax,
      shipping_cost: shippingCost,
      total
    }
  };
};

const generateOrderNumber = () => {
  const date = new Date();
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ORD-${y}${m}${d}-${rand}`;
};

export const checkout = async (userId: string, input: {
  name: string;
  phone: string;
  email: string;
  shipping_address: string;
  city: string;
  postal_code: string;
}) => {
  const summary = await getCheckoutSummary(userId);
  const orderNumber = generateOrderNumber();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      customer_name: input.name,
      customer_phone: input.phone,
      customer_email: input.email,
      shipping_address: input.shipping_address,
      shipping_city: input.city,
      shipping_postal_code: input.postal_code,
      total: summary.summary.total,
      status: "pending",
      order_number: orderNumber
    })
    .select("*")
    .single();

  if (orderError) {
    throw new AppError(orderError.message, 500);
  }

  const orderItems = summary.items.map((item: { product_id: string; quantity: number; unit_price: number }) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.unit_price
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) {
    throw new AppError(itemsError.message, 500);
  }

  // Clear cart
  const { error: clearError } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId);

  if (clearError) {
    throw new AppError(clearError.message, 500);
  }

  return {
    order_id: order.id,
    order_number: orderNumber,
    ...summary.summary
  };
};
