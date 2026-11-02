export const AUTH_BACKENDS = Object.freeze({
  FIREBASE: "firebase",
  SUPABASE: "supabase",
});

export function getAuthBackend() {
  const configured = import.meta.env.VITE_AUTH_BACKEND?.trim().toLowerCase();

  // V2 is Supabase-first. Keep the Firebase option only as a temporary explicit rollback path
  // while final cutover verification is in progress.
  if (!configured) return AUTH_BACKENDS.SUPABASE;

  if (!Object.values(AUTH_BACKENDS).includes(configured)) {
    throw new Error(`Unsupported VITE_AUTH_BACKEND: ${configured}`);
  }

  return configured;
}

export function isSupabaseAuthEnabled() {
  return getAuthBackend() === AUTH_BACKENDS.SUPABASE;
}
