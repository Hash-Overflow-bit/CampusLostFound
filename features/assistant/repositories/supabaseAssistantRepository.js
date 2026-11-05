import { getSupabaseClient } from "../../../lib/supabase/client";
import { ACTIVE_LIST_STATUSES } from "../../items/repositories/supabaseItemsRepository";

const SCAN_LIMIT = 48;
const RESULT_LIMIT = 8;

const normalize = (value) => String(value || "").trim().toLowerCase();

const tokenize = (value) =>
  normalize(value)
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1)
    .slice(0, 14);

const publicSearchText = (item) => [
  item.title,
  item.category,
  item.description,
  item.public_location,
  item.color,
  item.brand,
  item.kind,
].map(normalize).join(" ");

function scoreItem(item, query) {
  const tokens = tokenize(query);
  if (!tokens.length) return 0;

  const title = normalize(item.title);
  const category = normalize(item.category);
  const location = normalize(item.public_location);
  const color = normalize(item.color);
  const brand = normalize(item.brand);
  const description = normalize(item.description);
  const haystack = publicSearchText(item);

  let score = 0;

  tokens.forEach((token) => {
    if (title.includes(token)) score += 7;
    if (category.includes(token)) score += 5;
    if (location.includes(token)) score += 4;
    if (color.includes(token)) score += 4;
    if (brand.includes(token)) score += 4;
    if (description.includes(token)) score += 2;
    if (haystack.includes(token)) score += 1;
  });

  const q = normalize(query);
  if ((q.includes("i lost") || q.includes("lost my") || q.includes("mera") || q.includes("meri")) && item.kind === "found") {
    score += 4;
  }
  if ((q.includes("i found") || q.includes("found a") || q.includes("mila") || q.includes("mili")) && item.kind === "lost") {
    score += 4;
  }

  return score;
}

const sanitizePublicItem = (item) => ({
  kind: item.kind,
  status: item.status,
  title: item.title || "",
  category: item.category || "",
  color: item.color || "",
  brand: item.brand || "",
  description: item.description || "",
  location: item.public_location || "",
  occurredAt: item.occurred_at || item.created_at || "",
});

export async function getAssistantReportContext({ campusId, query }) {
  if (!campusId) return [];

  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase
    .from("items")
    .select("kind,status,title,category,description,public_location,occurred_at,color,brand,created_at")
    .eq("campus_id", campusId)
    .in("status", ACTIVE_LIST_STATUSES)
    .order("created_at", { ascending: false })
    .limit(SCAN_LIMIT);

  if (error) throw error;

  const ranked = (data || [])
    .map((item, index) => ({
      item,
      score: scoreItem(item, query),
      recency: SCAN_LIMIT - index,
    }))
    .sort((a, b) => b.score - a.score || b.recency - a.recency);

  const strong = ranked.filter((entry) => entry.score > 0);
  const selected = (strong.length ? strong : ranked.slice(0, 4)).slice(0, RESULT_LIMIT);

  return selected.map(({ item }) => sanitizePublicItem(item));
}
