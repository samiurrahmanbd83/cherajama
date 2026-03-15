"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkout = exports.getCheckoutSummary = void 0;
const supabase_1 = require("../database/supabase");
const env_1 = require("../config/env");
const AppError_1 = require("../utils/AppError");
const roundMoney = (value) => Math.round(value * 100) / 100;
const getCheckoutSummary = async (userId) => {
    const { data: items, error } = await supabase_1.supabase
        .from("cart_items")
        .select("id, product_id, quantity")
        .eq("user_id", userId);
    if (error) {
        throw new AppError_1.AppError(error.message, 500);
    }
    if (!items || !items.length) {
        throw new AppError_1.AppError("Cart is empty.", 400);
    }
    const productIds = items.map((item) => item.product_id);
    const { data: products, error: productError } = await supabase_1.supabase
        .from("products")
        .select("id, name, slug, price")
        .in("id", productIds);
    if (productError) {
        throw new AppError_1.AppError(productError.message, 500);
    }
    const productsById = (products || []).reduce((acc, product) => {
        acc[product.id] = product;
        return acc;
    }, {});
    const enriched = items.map((item) => {
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
    const subtotal = enriched.reduce((sum, item) => sum + Number(item.unit_price) * Number(item.quantity), 0);
    const tax = roundMoney(subtotal * env_1.env.TAX_RATE);
    const shippingCost = roundMoney(env_1.env.SHIPPING_FLAT_RATE);
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
exports.getCheckoutSummary = getCheckoutSummary;
const generateOrderNumber = () => {
    const date = new Date();
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, "0");
    const d = String(date.getUTCDate()).padStart(2, "0");
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `ORD-${y}${m}${d}-${rand}`;
};
const checkout = async (userId, input) => {
    const summary = await (0, exports.getCheckoutSummary)(userId);
    const orderNumber = generateOrderNumber();
    const { data: order, error: orderError } = await supabase_1.supabase
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
        throw new AppError_1.AppError(orderError.message, 500);
    }
    const orderItems = summary.items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.unit_price
    }));
    const { error: itemsError } = await supabase_1.supabase.from("order_items").insert(orderItems);
    if (itemsError) {
        throw new AppError_1.AppError(itemsError.message, 500);
    }
    // Clear cart
    const { error: clearError } = await supabase_1.supabase
        .from("cart_items")
        .delete()
        .eq("user_id", userId);
    if (clearError) {
        throw new AppError_1.AppError(clearError.message, 500);
    }
    return {
        order_id: order.id,
        order_number: orderNumber,
        ...summary.summary
    };
};
exports.checkout = checkout;
