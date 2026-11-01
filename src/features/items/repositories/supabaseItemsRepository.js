import { getSupabaseClient } from "../../../lib/supabase/client";

const PAGE_SIZE = 20;

function requireClient() {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase is not configured.");
  return client;
}

export async function listItems({ campusId, type, ownerId, cursor, pageSize = PAGE_SIZE }) {
  const supabase = requireClient();
  let query = supabase
    .from("items")
    .select("id, owner_id, campus_id, type, status, title, category, description, public_location, occurred_at, color, brand, created_at, item_images(id, storage_path, sort_order)")
    .eq("campus_id", campusId)
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(pageSize);

  if (type) query = query.eq("type", type);
  if (ownerId) query = query.eq("owner_id", ownerId);
  if (cursor) query = query.lt("created_at", cursor);

  const { data, error } = await query;
  if (error) throw error;

  const items = data ?? [];
  return {
    items,
    cursor: items.at(-1)?.created_at ?? null,
    hasMore: items.length === pageSize,
  };
}

export async function updateOwnedItem(itemId, patch) {
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

export async function closeOwnedItem(itemId) {
  return updateOwnedItem(itemId, { status: "closed" });
}
