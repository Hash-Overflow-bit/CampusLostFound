export const AUTH_BACKENDS = Object.freeze({
  FIREBASE: "firebase",
  SUPABASE: "supabase",
});

export function getAuthBackend() {
  const configured = import.meta.env.VITE_AUTH_BACKEND?.trim().toLowerCase();

  if (!configured) return AUTH_BACKENDS.FIREBASE;

  if (!Object.values(AUTH_BACKENDS).includes(configured)) {
    throw new Error(`Unsupported VITE_AUTH_BACKEND: ${configured}`);
  }

  return configured;
}

export function isSupabaseAuthEnabled() {
  return getAuthBackend() === AUTH_BACKENDS.SUPABASE;
}
