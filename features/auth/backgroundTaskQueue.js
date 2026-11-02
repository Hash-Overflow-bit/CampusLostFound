const pendingTasks = new Map();

function schedule(callback) {
  if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
    return window.requestIdleCallback(callback, { timeout: 1200 });
  }
  return setTimeout(callback, 0);
}

export function queueBackgroundTask(key, task) {
  if (!key || typeof task !== "function") return Promise.resolve();
  if (pendingTasks.has(key)) return pendingTasks.get(key);

  const promise = new Promise((resolve, reject) => {
    schedule(async () => {
      try {
        resolve(await task());
      } catch (error) {
        reject(error);
      } finally {
        pendingTasks.delete(key);
      }
    });
  });

  pendingTasks.set(key, promise);
  return promise;
}

export function hasQueuedTask(key) {
  return pendingTasks.has(key);
}
