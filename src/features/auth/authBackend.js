export const AUTH_BACKENDS = Object.freeze({
  SUPABASE: "supabase",
});

export function getAuthBackend() {
  return AUTH_BACKENDS.SUPABASE;
}

export function isSupabaseAuthEnabled() {
  return true;
}
