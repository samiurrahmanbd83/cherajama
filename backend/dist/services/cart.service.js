"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCartItem = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const supabase_1 = require("../database/supabase");
const AppError_1 = require("../utils/AppError");
const getCart = async (userId) => {
    const { data: items, error } = await supabase_1.supabase
        .from("cart_items")
        .select("id, product_id, quantity, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
    if (error) {
        throw new AppError_1.AppError(error.message, 500);
    }
    const productIds = (items || []).map((item) => item.product_id);
    let productsById = {};
    if (productIds.length) {
        const { data: products, error: productError } = await supabase_1.supabase
            .from("products")
            .select("id, name, slug, price, image")
            .in("id", productIds);
        if (productError) {
            throw new AppError_1.AppError(productError.message, 500);
        }
        productsById = (products || []).reduce((acc, product) => {
            acc[product.id] = product;
            return acc;
        }, {});
    }
    const enriched = (items || []).map((item) => {
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
exports.getCart = getCart;
const addToCart = async (userId, input) => {
    const { data: existing, error: existingError } = await supabase_1.supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("user_id", userId)
        .eq("product_id", input.product_id)
        .maybeSingle();
    if (existingError) {
        throw new AppError_1.AppError(existingError.message, 500);
    }
    if (existing) {
        const newQuantity = Number(existing.quantity) + Number(input.quantity);
        const { error: updateError } = await supabase_1.supabase
            .from("cart_items")
            .update({ quantity: newQuantity })
            .eq("id", existing.id);
        if (updateError) {
            throw new AppError_1.AppError(updateError.message, 500);
        }
    }
    else {
        const { error: insertError } = await supabase_1.supabase
            .from("cart_items")
            .insert({ user_id: userId, product_id: input.product_id, quantity: input.quantity });
        if (insertError) {
            throw new AppError_1.AppError(insertError.message, 500);
        }
    }
    return (0, exports.getCart)(userId);
};
exports.addToCart = addToCart;
const updateCartItem = async (userId, cartItemId, quantity) => {
    const { error } = await supabase_1.supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", cartItemId)
        .eq("user_id", userId);
    if (error) {
        throw new AppError_1.AppError(error.message, 500);
    }
    return (0, exports.getCart)(userId);
};
exports.updateCartItem = updateCartItem;
const removeCartItem = async (userId, cartItemId) => {
    const { error } = await supabase_1.supabase
        .from("cart_items")
        .delete()
        .eq("id", cartItemId)
        .eq("user_id", userId);
    if (error) {
        throw new AppError_1.AppError(error.message, 500);
    }
    return (0, exports.getCart)(userId);
};
exports.removeCartItem = removeCartItem;
