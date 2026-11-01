export const sleep = (milliseconds, signal) =>
  new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(resolve, milliseconds);

    if (!signal) return;

    const abort = () => {
      window.clearTimeout(timeoutId);
      reject(new DOMException("Request aborted", "AbortError"));
    };

    if (signal.aborted) abort();
    else signal.addEventListener("abort", abort, { once: true });
  });

export const retryWithBackoff = async (
  operation,
  { retries = 3, baseDelay = 250, maxDelay = 4000, signal } = {}
) => {
  let attempt = 0;

  while (true) {
    if (signal?.aborted) throw new DOMException("Request aborted", "AbortError");

    try {
      return await operation({ attempt, signal });
    } catch (error) {
      if (signal?.aborted || error?.name === "AbortError" || attempt >= retries) {
        throw error;
      }

      const exponentialDelay = Math.min(maxDelay, baseDelay * 2 ** attempt);
      const jitter = Math.random() * exponentialDelay * 0.25;
      await sleep(exponentialDelay + jitter, signal);
      attempt += 1;
    }
  }
};

export const createLatestRequest = () => {
  let controller = null;
  let sequence = 0;

  return async (operation) => {
    controller?.abort();
    controller = new AbortController();
    const currentSequence = ++sequence;

    const result = await operation({
      signal: controller.signal,
      sequence: currentSequence,
    });

    if (currentSequence !== sequence) {
      throw new DOMException("Stale request ignored", "AbortError");
    }

    return result;
  };
};

export const throttle = (callback, interval = 150) => {
  let lastRun = 0;
  let timeoutId = null;

  return (...args) => {
    const now = Date.now();
    const remaining = interval - (now - lastRun);

    if (remaining <= 0) {
      if (timeoutId) window.clearTimeout(timeoutId);
      timeoutId = null;
      lastRun = now;
      callback(...args);
      return;
    }

    if (!timeoutId) {
      timeoutId = window.setTimeout(() => {
        lastRun = Date.now();
        timeoutId = null;
        callback(...args);
      }, remaining);
    }
  };
};
