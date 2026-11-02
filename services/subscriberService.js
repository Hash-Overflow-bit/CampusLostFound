import { getSupabaseClient } from "../lib/supabase/client";

export const saveSubscriber = async (university, email) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Supabase is not configured.");

    const normalizedUniversity = String(university || "").trim();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!normalizedUniversity || !normalizedEmail) throw new Error("University and email are required.");

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ university: normalizedUniversity, email: normalizedEmail });

    if (error) {
      if (error.code === "23505") return { success: true, duplicate: true };
      throw error;
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
