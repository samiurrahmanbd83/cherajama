"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.cancelOrder = exports.getOrderById = exports.listOrders = exports.createOrderFromCart = void 0;
const supabase_1 = require("../database/supabase");
const AppError_1 = require("../utils/AppError");
const checkout_service_1 = require("./checkout.service");
const createOrderFromCart = async (userId, input) => {
    return (0, checkout_service_1.checkout)(userId, input);
};
exports.createOrderFromCart = createOrderFromCart;
const listOrders = async (userId, role) => {
    const query = supabase_1.supabase.from("orders").select("*").order("created_at", { ascending: false });
    const { data, error } = role === "admin" || role === "staff"
        ? await query
        : await query.eq("user_id", userId);
    if (error) {
        throw new AppError_1.AppError(error.message, 500);
    }
    return data || [];
};
exports.listOrders = listOrders;
const getOrderById = async (userId, role, id) => {
    const base = supabase_1.supabase.from("orders").select("*").eq("id", id);
    const { data, error } = role === "admin" || role === "staff" ? await base.maybeSingle() : await base.eq("user_id", userId).maybeSingle();
    if (error) {
        throw new AppError_1.AppError(error.message, 500);
    }
    if (!data) {
        throw new AppError_1.AppError("Order not found.", 404);
    }
    return data;
};
exports.getOrderById = getOrderById;
const cancelOrder = async (userId, role, id) => {
    const order = await (0, exports.getOrderById)(userId, role, id);
    const { data, error } = await supabase_1.supabase
        .from("orders")
        .update({ status: "cancelled" })
        .eq("id", order.id)
        .select("*")
        .single();
    if (error) {
        throw new AppError_1.AppError(error.message, 500);
    }
    return data;
};
exports.cancelOrder = cancelOrder;
const updateOrderStatus = async (id, status) => {
    const { data, error } = await supabase_1.supabase
        .from("orders")
        .update({ status })
        .eq("id", id)
        .select("*")
        .single();
    if (error) {
        throw new AppError_1.AppError(error.message, 500);
    }
    return data;
};
exports.updateOrderStatus = updateOrderStatus;
