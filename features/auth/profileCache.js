const PROFILE_CACHE_PREFIX = "clf.auth.profile.v2:";
export const PROFILE_CACHE_TTL_MS = 5 * 60 * 1000;

const memoryCache = new Map();

function storageKey(userId) {
  return `${PROFILE_CACHE_PREFIX}${userId}`;
}

function isBrowser() {
  return typeof window !== "undefined" && Boolean(window.sessionStorage);
}

export function readProfileCache(userId) {
  if (!userId) return null;

  const memoryEntry = memoryCache.get(userId);
  if (memoryEntry) {
    return {
      ...memoryEntry,
      isFresh: Date.now() - memoryEntry.cachedAt < PROFILE_CACHE_TTL_MS,
    };
  }

  if (!isBrowser()) return null;

  try {
    const raw = window.sessionStorage.getItem(storageKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.profile || parsed.profile.id !== userId || !parsed.cachedAt) return null;
    memoryCache.set(userId, parsed);
    return {
      ...parsed,
      isFresh: Date.now() - parsed.cachedAt < PROFILE_CACHE_TTL_MS,
    };
  } catch {
    return null;
  }
}

export function writeProfileCache(userId, profile) {
  if (!userId || !profile) return;
  const entry = { profile, cachedAt: Date.now() };
  memoryCache.set(userId, entry);

  if (!isBrowser()) return;
  try {
    window.sessionStorage.setItem(storageKey(userId), JSON.stringify(entry));
  } catch {
    // Cache is an optimization only; storage failures must never break auth.
  }
}

export function clearProfileCache(userId) {
  if (userId) {
    memoryCache.delete(userId);
    if (isBrowser()) {
      try { window.sessionStorage.removeItem(storageKey(userId)); } catch { /* noop */ }
    }
    return;
  }

  memoryCache.clear();
  if (!isBrowser()) return;
  try {
    Object.keys(window.sessionStorage)
      .filter((key) => key.startsWith(PROFILE_CACHE_PREFIX))
      .forEach((key) => window.sessionStorage.removeItem(key));
  } catch {
    // Cache cleanup is best-effort.
  }
}
