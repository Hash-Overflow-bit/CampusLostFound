import { supabase } from "../../../lib/supabaseClient";
import { generateMatchCandidates, toMatchRows } from "../matchCandidates";

const ITEM_FIELDS = [
  "id",
  "owner_id",
  "campus_id",
  "kind",
  "status",
  "title",
  "category",
  "brand",
  "color",
  "description",
  "public_location",
  "occurred_at",
].join(",");

export const buildCampusMatchCandidates = async (campusId, options = {}) => {
  if (!campusId) throw new Error("campusId is required");

  const { data, error } = await supabase
    .from("items")
    .select(ITEM_FIELDS)
    .eq("campus_id", campusId)
    .in("status", ["open", "possible_match", "claim_pending"]);

  if (error) throw error;
  return generateMatchCandidates(data ?? [], options);
};

export const saveMatchCandidates = async (candidates) => {
  const rows = toMatchRows(candidates);
  if (!rows.length) return [];

  const saved = [];

  // Avoid depending on a database upsert constraint until the schema explicitly
  // guarantees uniqueness for each lost/found pair.
  for (const row of rows) {
    const { data: existing, error: lookupError } = await supabase
      .from("matches")
      .select("id,score,algorithm_version")
      .eq("lost_item_id", row.lost_item_id)
      .eq("found_item_id", row.found_item_id)
      .maybeSingle();

    if (lookupError) throw lookupError;

    if (existing) {
      const { data, error } = await supabase
        .from("matches")
        .update({ score: row.score, algorithm_version: row.algorithm_version })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      saved.push(data);
      continue;
    }

    const { data, error } = await supabase
      .from("matches")
      .insert(row)
      .select()
      .single();
    if (error) throw error;
    saved.push(data);
  }

  return saved;
};

export const getMatchesForItem = async (itemId) => {
  if (!itemId) return [];

  const { data, error } = await supabase
    .from("matches")
    .select("id,lost_item_id,found_item_id,score,algorithm_version,created_at")
    .or(`lost_item_id.eq.${itemId},found_item_id.eq.${itemId}`)
    .order("score", { ascending: false });

  if (error) throw error;
  return data ?? [];
};
