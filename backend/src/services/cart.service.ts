import { supabase } from "../database/supabase";
import { AppError } from "../utils/AppError";

type CartItemRow = {
  id: string;
  product_id: string;
  quantity: number;
  created_at?: string | null;
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
};

export const getCart = async (userId: string) => {
  const { data: items, error } = await supabase
    .from("cart_items")
    .select("id, product_id, quantity, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new AppError(error.message, 500);
  }

  const productIds = (items || []).map((item: CartItemRow) => item.product_id);
  let productsById: Record<string, ProductRow> = {};
  if (productIds.length) {
    const { data: products, error: productError } = await supabase
      .from("products")
      .select("id, name, slug, price, image")
      .in("id", productIds);

    if (productError) {
      throw new AppError(productError.message, 500);
    }

    productsById = (products || []).reduce(
      (acc: Record<string, ProductRow>, product: ProductRow) => {
        acc[product.id] = product;
        return acc;
      },
      {} as Record<string, ProductRow>
    );
  }

  const enriched = (items || []).map((item: CartItemRow) => {
    const product = productsById[item.product_id];
    return {
      ...item,
      unit_price: product?.price ?? 0,
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      image: product?.image ?? null
    };
  });

  return { items: enriched };
};

export const addToCart = async (userId: string, input: { product_id: string; quantity: number }) => {
  const { data: existing, error: existingError } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", userId)
    .eq("product_id", input.product_id)
    .maybeSingle();

  if (existingError) {
    throw new AppError(existingError.message, 500);
  }

  if (existing) {
    const newQuantity = Number(existing.quantity) + Number(input.quantity);
    const { error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity: newQuantity })
      .eq("id", existing.id);

    if (updateError) {
      throw new AppError(updateError.message, 500);
    }
  } else {
    const { error: insertError } = await supabase
      .from("cart_items")
      .insert({ user_id: userId, product_id: input.product_id, quantity: input.quantity });

    if (insertError) {
      throw new AppError(insertError.message, 500);
    }
  }

  return getCart(userId);
};

export const updateCartItem = async (userId: string, cartItemId: string, quantity: number) => {
  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", cartItemId)
    .eq("user_id", userId);

  if (error) {
    throw new AppError(error.message, 500);
  }

  return getCart(userId);
};

export const removeCartItem = async (userId: string, cartItemId: string) => {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", cartItemId)
    .eq("user_id", userId);

  if (error) {
    throw new AppError(error.message, 500);
  }

  return getCart(userId);
};
