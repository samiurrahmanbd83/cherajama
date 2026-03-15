import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env";

const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  // Keep this module safe to import even if envs are missing.
  console.warn("Supabase client not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
}

export const supabase = createClient(supabaseUrl || "", supabaseKey || "", {
  auth: {
    persistSession: false
  }
});
