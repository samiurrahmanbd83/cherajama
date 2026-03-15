"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserRole = exports.listUsers = void 0;
const supabase_1 = require("../database/supabase");
const AppError_1 = require("../utils/AppError");
const listUsers = async (_query) => {
    const { data, error } = await supabase_1.supabase
        .from("users")
        .select("id, first_name, last_name, email, role, created_at")
        .order("created_at", { ascending: false });
    if (error) {
        throw new AppError_1.AppError(error.message, 500);
    }
    return data || [];
};
exports.listUsers = listUsers;
const updateUserRole = async (id, role) => {
    const { data, error } = await supabase_1.supabase
        .from("users")
        .update({ role })
        .eq("id", id)
        .select("id, first_name, last_name, email, role, created_at")
        .single();
    if (error) {
        throw new AppError_1.AppError(error.message, 500);
    }
    return data;
};
exports.updateUserRole = updateUserRole;
const deleteUser = async (id) => {
    const { error } = await supabase_1.supabase.from("users").delete().eq("id", id);
    if (error) {
        throw new AppError_1.AppError(error.message, 500);
    }
    return { id };
};
exports.deleteUser = deleteUser;
