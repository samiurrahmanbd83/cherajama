"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const env_1 = require("../config/env");
const supabaseUrl = env_1.env.SUPABASE_URL;
const supabaseKey = env_1.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
    // Keep this module safe to import even if envs are missing.
    console.warn("Supabase client not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
}
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl || "", supabaseKey || "", {
    auth: {
        persistSession: false
    }
});
