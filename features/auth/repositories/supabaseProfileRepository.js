import { getSupabaseClient } from "../../../lib/supabase/client";
import { clearProfileCache, readProfileCache, writeProfileCache } from "../profileCache";

function requireClient() {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase is not configured.");
  return client;
}

const PROFILE_SELECT = "id, campus_id, display_name, role, verified_at, campuses(id, name, slug, email_domain)";
const inFlightProfileRequests = new Map();

async function resolveUserId(client, explicitUserId) {
  if (explicitUserId) return explicitUserId;
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  return userData.user?.id || null;
}

export async function getCurrentProfile({ userId, force = false } = {}) {
  const client = requireClient();
  const resolvedUserId = await resolveUserId(client, userId);
  if (!resolvedUserId) return null;

  if (!force) {
    const cached = readProfileCache(resolvedUserId);
    if (cached?.isFresh) return cached.profile;
  }

  if (inFlightProfileRequests.has(resolvedUserId)) {
    return inFlightProfileRequests.get(resolvedUserId);
  }

  const request = client
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("id", resolvedUserId)
    .maybeSingle()
    .then(({ data, error }) => {
      if (error) throw error;
      if (data) writeProfileCache(resolvedUserId, data);
      return data;
    })
    .finally(() => {
      inFlightProfileRequests.delete(resolvedUserId);
    });

  inFlightProfileRequests.set(resolvedUserId, request);
  return request;
}

export async function onboardCurrentUserCampus({ userId } = {}) {
  const client = requireClient();
  const resolvedUserId = await resolveUserId(client, userId);
  if (!resolvedUserId) throw new Error("Authentication required");

  const { error } = await client.rpc("onboard_my_campus");
  if (error) throw error;
  clearProfileCache(resolvedUserId);
  return getCurrentProfile({ userId: resolvedUserId, force: true });
}

export async function updateCurrentProfile(patch, { userId } = {}) {
  const client = requireClient();
  const resolvedUserId = await resolveUserId(client, userId);
  if (!resolvedUserId) throw new Error("Authentication required");

  // Browser clients may edit presentation data only. Role, campus assignment and verification
  // state are trusted authorization fields and are intentionally excluded.
  const values = Object.fromEntries(
    Object.entries({ display_name: patch.display_name }).filter(([, value]) => value !== undefined)
  );

  if (!Object.keys(values).length) return getCurrentProfile({ userId: resolvedUserId });

  const { data, error } = await client
    .from("profiles")
    .update(values)
    .eq("id", resolvedUserId)
    .select(PROFILE_SELECT)
    .single();

  if (error) throw error;
  writeProfileCache(resolvedUserId, data);
  return data;
}
