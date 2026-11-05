import { getSupabaseSession } from "../../auth/supabaseAuthAdapter";
import { collectAssistantReply } from "../streamEvents.js";

const MAX_HISTORY = 6;

export async function askCampusAssistant({
  message,
  history = [],
  onToken,
  onComplete,
  signal,
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
    signal,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      history: history.slice(-MAX_HISTORY).map((entry) => ({
        role: entry.role,
        content: entry.content,
      })),
    }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const error = new Error(payload.error || "Campus Assistant is unavailable.");
    error.status = response.status;
    error.code = payload.code;
    error.retryAfter = payload.retryAfter || Number(response.headers.get("Retry-After")) || 0;
    throw error;
  }

  if (!response.headers.get("Content-Type")?.includes("text/event-stream")) {
    throw new Error("Campus Assistant is not available on this server. Please try the deployed app.");
  }
  return collectAssistantReply(response.body, { signal, onToken, onComplete });
}
