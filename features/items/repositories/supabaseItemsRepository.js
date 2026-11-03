import { getSupabaseClient } from "../../../lib/supabase/client";

export const ITEMS_PAGE_SIZE = 24;
export const ACTIVE_LIST_STATUSES = Object.freeze(["open", "possible_match", "claim_pending"]);
const BUCKET = "item-images";

function requireClient() {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase is not configured.");
  return client;
}

async function normalizeItem(supabase, item) {
  const firstImage = [...(item.item_images || [])].sort((a, b) => a.position - b.position)[0];
  let imageUrl = null;

  if (firstImage?.storage_path) {
    const { data } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(firstImage.storage_path, 900);
    imageUrl = data?.signedUrl || null;
  }

  return {
    ...item,
    userId: item.owner_id,
    role: item.kind,
    location: item.public_location,
    date: item.occurred_at,
    createdAt: item.created_at,
    imageUrl,
  };
}

export async function listItems({ campusId, type, ownerId, cursor, pageSize = ITEMS_PAGE_SIZE }) {
  const supabase = requireClient();

  let query = supabase
    .from("items")
    .select(
      "id, owner_id, campus_id, kind, status, title, category, description, public_location, occurred_at, color, brand, created_at, item_images(id, storage_path, position)",
      { count: "exact" }
    )
    .eq("campus_id", campusId)
    .in("status", ACTIVE_LIST_STATUSES)
    .order("created_at", { ascending: false })
    .limit(pageSize);

  if (type && type !== "all") query = query.eq("kind", type);
  if (ownerId) query = query.eq("owner_id", ownerId);
  if (cursor) query = query.lt("created_at", cursor);

  const { data, error, count } = await query;
  if (error) throw error;

  const rows = data ?? [];
  const items = await Promise.all(rows.map((item) => normalizeItem(supabase, item)));

  return {
    items,
    total: count ?? rows.length,
    cursor: rows.at(-1)?.created_at ?? null,
    hasMore: rows.length === pageSize,
  };
}

export async function getOwnedItemStats(ownerId) {
  if (!ownerId) return { total: 0, found: 0, lost: 0 };
  const supabase = requireClient();

  const { data, error } = await supabase
    .from("items")
    .select("kind")
    .eq("owner_id", ownerId)
    .neq("status", "closed");

  if (error) throw error;

  return (data ?? []).reduce((stats, item) => {
    stats.total += 1;
    if (item.kind === "found") stats.found += 1;
    if (item.kind === "lost") stats.lost += 1;
    return stats;
  }, { total: 0, found: 0, lost: 0 });
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
