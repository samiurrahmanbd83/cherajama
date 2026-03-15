"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.listCategories = void 0;
const supabase_1 = require("../database/supabase");
const AppError_1 = require("../utils/AppError");
const slugify_1 = require("../utils/slugify");
const listCategories = async () => {
    const { data, error } = await supabase_1.supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false });
    if (error) {
        throw new AppError_1.AppError(error.message, 500);
    }
    return data || [];
};
exports.listCategories = listCategories;
const createCategory = async (input) => {
    const slug = input.slug ? (0, slugify_1.slugify)(input.slug) : (0, slugify_1.slugify)(input.name);
    const { data: existing } = await supabase_1.supabase
        .from("categories")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
    if (existing) {
        throw new AppError_1.AppError("Category slug already exists.", 409);
    }
    const { data, error } = await supabase_1.supabase
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
        throw new AppError_1.AppError(error.message, 500);
    }
    return data;
};
exports.createCategory = createCategory;
const updateCategory = async (id, input) => {
    const payload = {
        ...input
    };
    if (payload.slug) {
        payload.slug = (0, slugify_1.slugify)(payload.slug);
    }
    const { data, error } = await supabase_1.supabase
        .from("categories")
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();
    if (error) {
        throw new AppError_1.AppError(error.message, 500);
    }
    return data;
};
exports.updateCategory = updateCategory;
const deleteCategory = async (id) => {
    const { error } = await supabase_1.supabase.from("categories").delete().eq("id", id);
    if (error) {
        throw new AppError_1.AppError(error.message, 500);
    }
    return { id };
};
exports.deleteCategory = deleteCategory;
