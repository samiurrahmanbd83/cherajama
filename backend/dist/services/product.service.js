"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.searchProducts = exports.getProductBySlug = exports.listProducts = void 0;
const supabase_1 = require("../database/supabase");
const AppError_1 = require("../utils/AppError");
const slugify_1 = require("../utils/slugify");
const listProducts = async () => {
    const { data, error } = await supabase_1.supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
    if (error) {
        throw new AppError_1.AppError(error.message, 500);
    }
    return data || [];
};
exports.listProducts = listProducts;
const getProductBySlug = async (slug) => {
    const { data, error } = await supabase_1.supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
    if (error) {
        throw new AppError_1.AppError(error.message, 500);
    }
    if (!data) {
        throw new AppError_1.AppError("Product not found.", 404);
    }
    return data;
};
exports.getProductBySlug = getProductBySlug;
const searchProducts = async (query) => {
    let builder = supabase_1.supabase.from("products").select("*");
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
        throw new AppError_1.AppError(error.message, 500);
    }
    return data || [];
};
exports.searchProducts = searchProducts;
const createProduct = async (input) => {
    const slug = input.slug ? (0, slugify_1.slugify)(input.slug) : (0, slugify_1.slugify)(input.name);
    const { data: existing } = await supabase_1.supabase
        .from("products")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
    if (existing) {
        throw new AppError_1.AppError("Product slug already exists.", 409);
    }
    const { data, error } = await supabase_1.supabase
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
        throw new AppError_1.AppError(error.message, 500);
    }
    return data;
};
exports.createProduct = createProduct;
const updateProduct = async (id, input) => {
    const payload = {
        ...input
    };
    if (payload.slug) {
        payload.slug = (0, slugify_1.slugify)(payload.slug);
    }
    const { data, error } = await supabase_1.supabase
        .from("products")
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();
    if (error) {
        throw new AppError_1.AppError(error.message, 500);
    }
    return data;
};
exports.updateProduct = updateProduct;
const deleteProduct = async (id) => {
    const { error } = await supabase_1.supabase.from("products").delete().eq("id", id);
    if (error) {
        throw new AppError_1.AppError(error.message, 500);
    }
    return { id };
};
exports.deleteProduct = deleteProduct;
