import { getSupabaseClient } from "../../../lib/supabase/client";
import { ACTIVE_LIST_STATUSES } from "../../items/repositories/supabaseItemsRepository";
import { selectRelevantReports } from "../reportContext.js";

export async function getAssistantReportContext({ campusId, query, history = [] }) {
  if (!campusId) return [];
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase
    .from("items")
    .select("kind,status,title,category,description,public_location,occurred_at,color,brand,created_at")
    .eq("campus_id", campusId)
    .in("status", ACTIVE_LIST_STATUSES)
    .order("created_at", { ascending: false })
    .limit(48);
  if (error) throw error;
  return selectRelevantReports(data || [], { message: query, history });
}
