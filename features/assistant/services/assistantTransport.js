import { collectAssistantReply } from "../streamEvents.js";

export function normalizeAssistantFailure(error, receivedText = false) {
  if (error?.name === "AbortError") return error;
  if (error?.name === "NetworkError" || /load failed|failed to fetch|fetch failed|network request failed|network connection.*lost/i.test(error?.message || "")) {
    return Object.assign(new Error(receivedText
      ? "The connection dropped while replying. Please retry your question."
      : "Couldn’t connect to Campus Assistant. Reload the page to refresh your connection and access, then try again."), {
      code: "assistant/connection", cause: error,
    });
  }
  return error;
}

export async function requestAssistantReply({ token, message, history = [], onToken, onComplete, signal }) {
  let receivedText = false;
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      credentials: "same-origin",
      signal,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        history: history.slice(-6).map(({ role, content }) => ({ role, content })),
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw Object.assign(new Error(payload.error || "Campus Assistant is unavailable."), {
        status: response.status, code: payload.code,
        retryAfter: payload.retryAfter || Number(response.headers.get("Retry-After")) || 0,
      });
    }
    if (!response.headers.get("Content-Type")?.includes("text/event-stream")) {
      throw Object.assign(new Error("Your page or preview access may have expired. Reload the page, sign in if prompted, and try again."), {
        code: "assistant/preview-access",
      });
    }
    return await collectAssistantReply(response.body, {
      signal, onComplete,
      onToken: (chunk, fullText) => { receivedText = true; onToken?.(chunk, fullText); },
    });
  } catch (error) {
    throw normalizeAssistantFailure(error, receivedText);
  }
}
