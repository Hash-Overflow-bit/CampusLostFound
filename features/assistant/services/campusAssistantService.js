import { getSupabaseSession } from "../../auth/supabaseAuthAdapter";
import { normalizeAssistantFailure, requestAssistantReply } from "./assistantTransport.js";

export async function askCampusAssistant({
  message,
  history = [],
  onToken,
  onComplete,
  signal,
}) {
  let session;
  try { session = await getSupabaseSession(); }
  catch (error) { throw normalizeAssistantFailure(error); }
  const token = session?.access_token;

  if (!token) {
    const error = new Error("Your session expired. Sign in again to use Campus Assistant.");
    error.code = "assistant/session-required";
    throw error;
  }

  return requestAssistantReply({ token, message, history, signal, onToken, onComplete });
}
