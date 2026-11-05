import { getSupabaseSession } from "../../auth/supabaseAuthAdapter";

const MAX_HISTORY = 6;

export async function askCampusAssistant({
  message,
  history = [],
  campusName = "",
  onToken,
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
      campusName,
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
    throw error;
  }

  if (!response.body) {
    throw new Error("Campus Assistant did not return a live response.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    if (!chunk) continue;

    fullText += chunk;
    onToken?.(chunk, fullText);
  }

  const tail = decoder.decode();
  if (tail) {
    fullText += tail;
    onToken?.(tail, fullText);
  }

  const reply = fullText.trim();
  if (!reply) throw new Error("Campus Assistant returned an empty response.");

  return reply;
}
