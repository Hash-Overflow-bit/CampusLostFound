import { getSupabaseSession } from "../../auth/supabaseAuthAdapter";

const MAX_HISTORY = 6;

export async function askCampusAssistant({
  message,
  history = [],
  reports = [],
  campusName = "",
}) {
  const session = await getSupabaseSession();
  const token = session?.access_token;

  if (!token) {
    const error = new Error("Your session expired. Sign in again to use Campus Assistant.");
    error.code = "assistant/session-required";
    throw error;
  }

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      campusName,
      reports,
      history: history.slice(-MAX_HISTORY).map((entry) => ({
        role: entry.role,
        content: entry.content,
      })),
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(payload.error || "Campus Assistant is unavailable.");
    error.status = response.status;
    throw error;
  }

  return payload.reply;
}
