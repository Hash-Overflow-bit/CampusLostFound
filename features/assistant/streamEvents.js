// Shared by the browser and server so interruptions never look like complete replies.
export async function* readServerEvents(body, signal) {
  if (!body) throw new Error("The assistant did not return a readable stream.");
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finished = false;
  const abort = () => { reader.cancel().catch(() => {}); };
  signal?.addEventListener("abort", abort, { once: true });

  function parseEvent(block) {
    let event = "message";
    const data = [];
    for (const line of block.split(/\r?\n/)) {
      if (line.startsWith("event:")) event = line.slice(6).trim();
      if (line.startsWith("data:")) data.push(line.slice(5).replace(/^ /, ""));
    }
    return data.length ? { event, data: data.join("\n") } : null;
  }

  try {
    while (true) {
      if (signal?.aborted) throw new DOMException("Request stopped.", "AbortError");
      const { value, done } = await reader.read();
      if (signal?.aborted) throw new DOMException("Request stopped.", "AbortError");
      buffer += done ? decoder.decode() : decoder.decode(value, { stream: true });
      if (buffer.length > 262_144) throw new Error("The assistant returned an invalid stream.");
      let boundary;
      while ((boundary = /\r?\n\r?\n/.exec(buffer))) {
        const parsed = parseEvent(buffer.slice(0, boundary.index));
        buffer = buffer.slice(boundary.index + boundary[0].length);
        if (parsed) yield parsed;
      }
      if (done) {
        finished = true;
        const parsed = parseEvent(buffer);
        if (parsed) yield parsed;
        break;
      }
    }
  } finally {
    signal?.removeEventListener("abort", abort);
    if (!finished) await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

export async function collectAssistantReply(body, { signal, onToken, onComplete } = {}) {
  let fullText = "";
  for await (const { event, data } of readServerEvents(body, signal)) {
    let payload;
    try { payload = JSON.parse(data); }
    catch { throw new Error("The live reply was interrupted. Please retry."); }
    if (event === "error") {
      throw Object.assign(new Error(payload.error || "The live reply was interrupted."), {
        code: payload.code, retryAfter: payload.retryAfter || 0,
      });
    }
    if (event === "delta" && typeof payload.text === "string") {
      fullText += payload.text;
      onToken?.(payload.text, fullText);
    }
    if (event === "done") {
      if (!fullText.trim()) throw new Error("Campus Assistant returned an empty response.");
      onComplete?.(payload);
      return fullText.trim();
    }
  }
  throw new Error("The live reply was interrupted. Please retry the question.");
}
