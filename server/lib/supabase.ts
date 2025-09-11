import { createClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../shared/types";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("Supabase environment variables not configured");
}

// Create Supabase client with service role for server-side operations
export const supabase = createClient<Database>(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseServiceKey || "placeholder_key",
);

// Check if Supabase is properly configured
export const isSupabaseConfigured = !!(
  supabaseUrl &&
  supabaseServiceKey &&
  supabaseUrl !== "https://placeholder.supabase.co" &&
  supabaseServiceKey !== "placeholder_key"
);

const forceNoDb = process.env.FORCE_NO_DB === "1";
export const shouldSkipSupabase = () => forceNoDb || !isSupabaseConfigured;
