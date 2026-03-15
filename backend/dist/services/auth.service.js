"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = exports.loginUser = exports.registerUser = void 0;
const supabase_1 = require("../database/supabase");
const AppError_1 = require("../utils/AppError");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const mapUser = (row) => ({
    id: row.id,
    firstName: row.first_name || "",
    lastName: row.last_name || "",
    email: row.email,
    role: row.role
});
const registerUser = async (input) => {
    const { data: existing, error: existingError } = await supabase_1.supabase
        .from("users")
        .select("id")
        .eq("email", input.email)
        .maybeSingle();
    if (existingError) {
        throw new AppError_1.AppError(existingError.message, 500);
    }
    if (existing) {
        throw new AppError_1.AppError("Email already registered.", 409);
    }
    const passwordHash = await (0, password_1.hashPassword)(input.password);
    const { data, error } = await supabase_1.supabase
        .from("users")
        .insert({
        first_name: input.firstName,
        last_name: input.lastName,
        email: input.email,
        password_hash: passwordHash,
        role: "customer",
        is_active: true
    })
        .select("*")
        .single();
    if (error) {
        throw new AppError_1.AppError(error.message, 500);
    }
    const user = mapUser(data);
    const token = (0, jwt_1.signToken)({
        sub: user.id,
        email: user.email,
        role: user.role
    });
    return { user, token };
};
exports.registerUser = registerUser;
const loginUser = async (input) => {
    const { data, error } = await supabase_1.supabase
        .from("users")
        .select("*")
        .eq("email", input.email)
        .maybeSingle();
    if (error) {
        throw new AppError_1.AppError(error.message, 500);
    }
    if (!data || data.is_active === false) {
        throw new AppError_1.AppError("Invalid credentials.", 401);
    }
    const valid = await (0, password_1.comparePassword)(input.password, data.password_hash);
    if (!valid) {
        throw new AppError_1.AppError("Invalid credentials.", 401);
    }
    const user = mapUser(data);
    const token = (0, jwt_1.signToken)({
        sub: user.id,
        email: user.email,
        role: user.role
    });
    return { user, token };
};
exports.loginUser = loginUser;
const getProfile = async (userId) => {
    const { data, error } = await supabase_1.supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
    if (error) {
        throw new AppError_1.AppError(error.message, 500);
    }
    if (!data) {
        throw new AppError_1.AppError("User not found.", 404);
    }
    return mapUser(data);
};
exports.getProfile = getProfile;
const updateProfile = async (userId, input) => {
    const payload = {};
    if (input.firstName !== undefined)
        payload.first_name = input.firstName;
    if (input.lastName !== undefined)
        payload.last_name = input.lastName;
    if (input.email !== undefined)
        payload.email = input.email;
    if (input.password) {
        payload.password_hash = await (0, password_1.hashPassword)(input.password);
    }
    const { data, error } = await supabase_1.supabase
        .from("users")
        .update(payload)
        .eq("id", userId)
        .select("*")
        .single();
    if (error) {
        throw new AppError_1.AppError(error.message, 500);
    }
    return mapUser(data);
};
exports.updateProfile = updateProfile;
