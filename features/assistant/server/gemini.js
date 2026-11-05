import { readServerEvents } from "../streamEvents.js";

// Free-tier eligibility is documented by Google. The API key's project must be
// on Google's free tier; a billing-enabled project can still charge for these IDs.
export const FREE_TIER_MODELS = Object.freeze([
  "gemini-3.8-flash",
  "gemini-3.5-flash-lite",
]);

export function assistantError(message, status = 503, code = "assistant/unavailable", retryAfter = 0) {
  return Object.assign(new Error(message), { status, code, retryAfter });
}

export function getGeminiConfig() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw assistantError("Campus Assistant is awaiting setup. You can still browse and report items.", 503, "assistant/not-configured");
  }
  const primary = process.env.GEMINI_MODEL?.trim() || FREE_TIER_MODELS[0];
  const fallback = process.env.GEMINI_FALLBACK_MODEL?.trim() || FREE_TIER_MODELS[1];
  const models = [...new Set([primary, fallback])];
  if (models.some((model) => !FREE_TIER_MODELS.includes(model))) {
    throw assistantError("Campus Assistant's Gemini configuration needs attention.", 503, "assistant/model-config");
  }
  return { apiKey, models };
}

function providerError(status, payload, retryHeader) {
  if (status === 429) {
    const retryInfo = payload?.error?.details?.find((detail) => detail["@type"]?.endsWith("RetryInfo"));
    const retryAfter = Math.min(3600, Math.max(1, Math.ceil(Number.parseFloat(retryHeader || retryInfo?.retryDelay) || 60)));
    return assistantError("Gemini's free quota is busy or exhausted. Please wait and try again later.", 429, "assistant/quota", retryAfter);
  }
  if ([400, 401, 403].includes(status)) {
    return assistantError("Campus Assistant's Gemini access needs attention. Please try again later.", 503, "assistant/provider-access");
  }
  return assistantError("Gemini is temporarily unavailable. Please try again shortly.", 503, "assistant/provider-unavailable");
}

export async function openGeminiStream({ apiKey, models, systemPrompt, history, message, signal }) {
  const contents = [];
  for (const entry of [...history, { role: "user", content: message }]) {
    const role = entry.role === "assistant" ? "model" : "user";
    // Gemini conversation history starts with a user turn.
    if (!contents.length && role === "model") continue;
    const previous = contents.at(-1);
    if (previous?.role === role) previous.parts.push({ text: entry.content });
    else contents.push({ role, parts: [{ text: entry.content }] });
  }

  for (let index = 0; index < models.length; index += 1) {
    const model = models[index];
    const result = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`, {
      method: "POST",
      signal,
      headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: {
          maxOutputTokens: 1536,
          thinkingConfig: { thinkingLevel: "LOW", includeThoughts: false },
        },
      }),
    });
    if (result.ok) return { result, model };
    const payload = await result.json().catch(() => ({}));
    // At most one alternate free-tier-eligible model, before any reply is sent.
    // Never fall back to AI Gateway, a paid model, or another API key.
    if ([404, 429, 500, 502, 503, 504].includes(result.status) && index + 1 < models.length) continue;
    throw providerError(result.status, payload, result.headers.get("Retry-After"));
  }
  throw assistantError("Gemini is temporarily unavailable.");
}

export async function* readGeminiReply(body, signal) {
  let hasText = false;
  let finishReason = "";
  for await (const { data } of readServerEvents(body, signal)) {
    let payload;
    try { payload = JSON.parse(data); }
    catch { throw assistantError("The live reply was interrupted. Please retry.", 502, "assistant/invalid-stream"); }
    if (payload.error) throw providerError(Number(payload.error.code) || 503, payload);
    const candidate = payload.candidates?.[0];
    if (payload.promptFeedback?.blockReason || (candidate?.finishReason && !["STOP", "MAX_TOKENS"].includes(candidate.finishReason))) {
      throw assistantError("Gemini could not answer that question. Try rephrasing it without personal details.", 422, "assistant/blocked");
    }
    for (const part of candidate?.content?.parts || []) {
      if (!part.thought && typeof part.text === "string" && part.text) {
        hasText = true;
        yield { type: "delta", text: part.text };
      }
    }
    if (candidate?.finishReason) finishReason = candidate.finishReason;
  }
  if (!hasText || !finishReason) {
    throw assistantError("The live reply was interrupted. Please retry.", 502, "assistant/incomplete-stream");
  }
  yield { type: "done", truncated: finishReason === "MAX_TOKENS" };
}
