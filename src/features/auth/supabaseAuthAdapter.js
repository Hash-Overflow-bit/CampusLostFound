import { getSupabaseClient } from "../../lib/supabase/client";

export async function getSupabaseSession() {
  const { data, error } = await getSupabaseClient().auth.getSession();
  if (error) throw error;
  return data.session;
}

export function subscribeToSupabaseAuth(callback) {
  const { data } = getSupabaseClient().auth.onAuthStateChange((event, session) => {
    callback(session, event);
  });

  return () => data.subscription.unsubscribe();
}

export async function signInWithSupabaseEmail(email, password) {
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
  const { data, error } = await getSupabaseClient().auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
  if (error) throw error;
  return data;
}

export async function signOutSupabase() {
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
  const { data, error } = await getSupabaseClient().auth.updateUser({ password });
  if (error) throw error;
  return data.user;
}
