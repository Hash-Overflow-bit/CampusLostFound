import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig, isSupabaseConfigured } from "./config";

let client;

export function getSupabaseClient() {
  if (!isSupabaseConfigured) return null;
  if (client) return client;

  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return client;
}
