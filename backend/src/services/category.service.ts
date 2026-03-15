import { supabase } from "../database/supabase";
import { AppError } from "../utils/AppError";
import { slugify } from "../utils/slugify";

type CategoryInput = {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  parent_id?: string | null;
};

export const listCategories = async () => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new AppError(error.message, 500);
  }

  return data || [];
};

export const createCategory = async (input: CategoryInput) => {
  const slug = input.slug ? slugify(input.slug) : slugify(input.name);

  const { data: existing } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) {
    throw new AppError("Category slug already exists.", 409);
  }

  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: input.name,
      slug,
      description: input.description ?? null,
      image: input.image ?? null,
      parent_id: input.parent_id ?? null
    })
    .select("*")
    .single();

  if (error) {
    throw new AppError(error.message, 500);
  }

  return data;
};

export const updateCategory = async (id: string, input: Partial<CategoryInput>) => {
  const payload: Record<string, any> = {
    ...input
  };

  if (payload.slug) {
    payload.slug = slugify(payload.slug);
  }

  const { data, error } = await supabase
    .from("categories")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new AppError(error.message, 500);
  }

  return data;
};

export const deleteCategory = async (id: string) => {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) {
    throw new AppError(error.message, 500);
  }
  return { id };
};
