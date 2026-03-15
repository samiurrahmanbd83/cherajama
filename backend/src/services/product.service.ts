import { supabase } from "../database/supabase";
import { AppError } from "../utils/AppError";
import { slugify } from "../utils/slugify";

type ProductInput = {
  name: string;
  slug?: string;
  description?: string;
  price: number;
  image?: string;
  category_id?: string | null;
  stock?: number;
  files?: unknown;
};

type ProductSearch = {
  keyword?: string;
  category_id?: string;
  min_price?: number;
  max_price?: number;
};

export const listProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new AppError(error.message, 500);
  }

  return data || [];
};

export const getProductBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new AppError(error.message, 500);
  }
  if (!data) {
    throw new AppError("Product not found.", 404);
  }
  return data;
};

export const searchProducts = async (query: ProductSearch) => {
  let builder = supabase.from("products").select("*");

  if (query.keyword) {
    const keyword = `%${query.keyword}%`;
    builder = builder.or(`name.ilike.${keyword},description.ilike.${keyword}`);
  }
  if (query.category_id) {
    builder = builder.eq("category_id", query.category_id);
  }
  if (typeof query.min_price === "number") {
    builder = builder.gte("price", query.min_price);
  }
  if (typeof query.max_price === "number") {
    builder = builder.lte("price", query.max_price);
  }

  const { data, error } = await builder.order("created_at", { ascending: false });
  if (error) {
    throw new AppError(error.message, 500);
  }
  return data || [];
};

export const createProduct = async (input: ProductInput) => {
  const slug = input.slug ? slugify(input.slug) : slugify(input.name);

  const { data: existing } = await supabase
    .from("products")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) {
    throw new AppError("Product slug already exists.", 409);
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: input.name,
      slug,
      description: input.description ?? null,
      price: input.price,
      image: input.image ?? null,
      category_id: input.category_id ?? null,
      stock: input.stock ?? 0
    })
    .select("*")
    .single();

  if (error) {
    throw new AppError(error.message, 500);
  }

  return data;
};

export const updateProduct = async (id: string, input: Partial<ProductInput>) => {
  const payload: Record<string, any> = {
    ...input
  };

  if (payload.slug) {
    payload.slug = slugify(payload.slug);
  }

  const { data, error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new AppError(error.message, 500);
  }

  return data;
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    throw new AppError(error.message, 500);
  }
  return { id };
};
