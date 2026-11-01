import { getSupabaseClient } from "../../lib/supabase/client";

const RECOVERY_MARKER = "campuslostfound:password-recovery";

export async function getSupabaseSession() {
  const { data, error } = await getSupabaseClient().auth.getSession();
  if (error) throw error;
  return data.session;
}

export function subscribeToSupabaseAuth(callback) {
  const { data } = getSupabaseClient().auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY") sessionStorage.setItem(RECOVERY_MARKER, "1");
    if (event === "SIGNED_OUT") sessionStorage.removeItem(RECOVERY_MARKER);
    callback(session, event);
  });

  return () => data.subscription.unsubscribe();
}

export function hasPasswordRecoveryIntent() {
  return sessionStorage.getItem(RECOVERY_MARKER) === "1";
}

export function clearPasswordRecoveryIntent() {
  sessionStorage.removeItem(RECOVERY_MARKER);
}

export async function signInWithSupabaseEmail(email, password) {
  clearPasswordRecoveryIntent();
  const { data, error } = await getSupabaseClient().auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUpWithSupabaseEmail(email, password, metadata = {}) {
  const { data, error } = await getSupabaseClient().auth.signUp({
    email,
    password,
    options: { data: metadata },
  });
  if (error) throw error;
  return data;
}

export async function resendSupabaseConfirmation(email, redirectTo) {
  const { data, error } = await getSupabaseClient().auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: redirectTo },
  });
  if (error) throw error;
  return data;
}

export async function signInWithGoogle(redirectTo = window.location.origin) {
  clearPasswordRecoveryIntent();
  const { data, error } = await getSupabaseClient().auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
  if (error) throw error;
  return data;
}

export async function signOutSupabase() {
  clearPasswordRecoveryIntent();
  const { error } = await getSupabaseClient().auth.signOut();
  if (error) throw error;
}

export async function sendSupabasePasswordReset(email, redirectTo) {
  const { error } = await getSupabaseClient().auth.resetPasswordForEmail(email, {
    redirectTo,
  });
  if (error) throw error;
}

export async function updateSupabasePassword(password) {
  if (!hasPasswordRecoveryIntent()) {
    const error = new Error("Password recovery session is missing or expired.");
    error.code = "auth/recovery-session-required";
    throw error;
  }
  const { data, error } = await getSupabaseClient().auth.updateUser({ password });
  if (error) throw error;
  clearPasswordRecoveryIntent();
  return data.user;
}
