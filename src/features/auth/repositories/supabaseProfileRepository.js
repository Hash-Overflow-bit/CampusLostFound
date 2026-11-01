import { getSupabaseClient } from "../../../lib/supabase/client";

function requireClient() {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase is not configured.");
  return client;
}

export async function getCurrentProfile() {
  const client = requireClient();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) return null;

  const { data, error } = await client
    .from("profiles")
    .select("id, campus_id, display_name, role, verified_at, campuses(id, name, slug, email_domain)")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateCurrentProfile(patch) {
  const client = requireClient();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error("Authentication required");

  // Browser clients may edit presentation data only. Role, campus assignment and verification
  // state are trusted authorization fields and are intentionally excluded.
  const values = Object.fromEntries(
    Object.entries({ display_name: patch.display_name }).filter(([, value]) => value !== undefined)
  );

  if (!Object.keys(values).length) return getCurrentProfile();

  const { data, error } = await client
    .from("profiles")
    .update(values)
    .eq("id", userData.user.id)
    .select("id, campus_id, display_name, role, verified_at, campuses(id, name, slug, email_domain)")
    .single();

  if (error) throw error;
  return data;
}
