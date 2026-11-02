import {
  resendSupabaseConfirmation,
  sendSupabasePasswordReset,
  signInWithSupabaseEmail,
  signOutSupabase,
  signUpWithSupabaseEmail,
  updateSupabasePassword,
} from "./supabaseAuthAdapter";

function getAppUrl() {
  const configured = import.meta.env.VITE_APP_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  if (typeof window !== "undefined" && window.location?.origin) return window.location.origin;
  return "https://campuslostfound.vercel.app";
}

export async function signIn(email, password) {
  const result = await signInWithSupabaseEmail(email, password);
  if (!result.user?.email_confirmed_at) {
    await signOutSupabase();
    const error = new Error("Email confirmation required");
    error.code = "auth/email-not-verified";
    throw error;
  }
  return result.user;
}

export async function signUp({ email, password, fullName, university, campus }) {
  const metadata = { full_name: fullName, university, campus };
  const result = await signUpWithSupabaseEmail(email, password, metadata);
  if (result.session && !result.user?.email_confirmed_at) await signOutSupabase();
  return result;
}

export async function resendConfirmation(email) {
  return resendSupabaseConfirmation(email, `${getAppUrl()}/login`);
}

export async function requestPasswordReset(email) {
  return sendSupabasePasswordReset(email, `${getAppUrl()}/update-password`);
}

export async function setNewPassword(password) {
  const user = await updateSupabasePassword(password);
  await signOutSupabase();
  return user;
}
