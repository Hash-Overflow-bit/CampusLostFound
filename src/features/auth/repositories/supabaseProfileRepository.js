import { getSupabaseClient } from "../../../lib/supabase/client";

export async function getCurrentProfile() {
  const client = getSupabaseClient();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) return null;

  const { data, error } = await client
    .from("profiles")
    .select("id, campus_id, display_name, avatar_path, role, verified_at, campuses(id, name, slug, email_domain)")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateCurrentProfile(patch) {
  const client = getSupabaseClient();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error("Authentication required");

  const allowed = {
    display_name: patch.display_name,
    avatar_path: patch.avatar_path,
    campus_id: patch.campus_id,
  };

  const values = Object.fromEntries(
    Object.entries(allowed).filter(([, value]) => value !== undefined)
  );

  const { data, error } = await client
    .from("profiles")
    .update(values)
    .eq("id", userData.user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
