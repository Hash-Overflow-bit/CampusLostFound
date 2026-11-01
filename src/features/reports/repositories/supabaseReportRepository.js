import { getSupabaseClient } from "../../../lib/supabase/client";

function requireClient() {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase is not configured.");
  return client;
}

export async function createReport({ item, privateDetails }) {
  const supabase = requireClient();
  const { data: created, error } = await supabase
    .from("items")
    .insert(item)
    .select()
    .single();
  if (error) throw error;

  if (privateDetails && Object.values(privateDetails).some(Boolean)) {
    const { error: privateError } = await supabase.from("item_private_details").insert({
      item_id: created.id,
      ...privateDetails,
    });
    if (privateError) throw privateError;
  }

  return created;
}

export async function updateReport(itemId, patch) {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from("items")
    .update(patch)
    .eq("id", itemId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
