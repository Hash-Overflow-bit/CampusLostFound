import { getSupabaseClient } from "../../../lib/supabase/client";

function requireClient() {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase is not configured.");
  return client;
}

const PROFILE_SELECT = "id, campus_id, display_name, role, verified_at, campuses(id, name, slug, email_domain)";

export async function getCurrentProfile() {
  const client = requireClient();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) return null;

  const { data, error } = await client
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("id", userData.user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function onboardCurrentUserCampus() {
  const client = requireClient();
  const { error } = await client.rpc("onboard_my_campus");
  if (error) throw error;
  return getCurrentProfile();
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
    .select(PROFILE_SELECT)
    .single();

  if (error) throw error;
  return data;
}
