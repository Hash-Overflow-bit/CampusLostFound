export function normalizeFirebaseUser(user) {
  if (!user) return null;

  return {
    id: user.uid,
    uid: user.uid,
    email: user.email ?? null,
    displayName: user.displayName ?? null,
    avatarUrl: user.photoURL ?? null,
    emailVerified: Boolean(user.emailVerified),
    provider: "firebase",
    raw: user,
  };
}

export function normalizeSupabaseUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    uid: user.id,
    email: user.email ?? null,
    displayName: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
    avatarUrl: user.user_metadata?.avatar_url ?? null,
    emailVerified: Boolean(user.email_confirmed_at),
    provider: "supabase",
    raw: user,
  };
}
