import { auth } from "../../firebaseConfig/firebaseCore";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { AUTH_BACKENDS, getAuthBackend } from "./authBackend";
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
  if (getAuthBackend() === AUTH_BACKENDS.SUPABASE) {
    const result = await signInWithSupabaseEmail(email, password);
    if (!result.user?.email_confirmed_at) {
      await signOutSupabase();
      const error = new Error("Email confirmation required");
      error.code = "auth/email-not-verified";
      throw error;
    }
    return result.user;
  }

  const result = await signInWithEmailAndPassword(auth, email, password);
  if (!result.user.emailVerified) {
    await signOut(auth);
    const error = new Error("Email confirmation required");
    error.code = "auth/email-not-verified";
    throw error;
  }
  return result.user;
}

export async function signUp({ email, password, fullName, university, campus }) {
  const metadata = { full_name: fullName, university, campus };

  if (getAuthBackend() === AUTH_BACKENDS.SUPABASE) {
    const result = await signUpWithSupabaseEmail(email, password, metadata);
    // Email-confirmation flows must not leave an unverified authenticated session behind.
    if (result.session && !result.user?.email_confirmed_at) await signOutSupabase();
    return result;
  }

  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName: fullName });
  await sendEmailVerification(result.user, { url: `${getAppUrl()}/login`, handleCodeInApp: false });
  await signOut(auth);
  return { user: result.user };
}

export async function resendConfirmation(email) {
  if (getAuthBackend() === AUTH_BACKENDS.SUPABASE) {
    return resendSupabaseConfirmation(email, `${getAppUrl()}/login`);
  }

  const error = new Error("Sign in again to resend your confirmation email.");
  error.code = "auth/reauth-required";
  throw error;
}

export async function requestPasswordReset(email) {
  if (getAuthBackend() === AUTH_BACKENDS.SUPABASE) {
    return sendSupabasePasswordReset(email, `${getAppUrl()}/update-password`);
  }

  return sendPasswordResetEmail(auth, email, { url: `${getAppUrl()}/login`, handleCodeInApp: false });
}

export async function setNewPassword(password) {
  if (getAuthBackend() !== AUTH_BACKENDS.SUPABASE) {
    const error = new Error("Use the password reset link provided by the authentication service.");
    error.code = "auth/recovery-provider-required";
    throw error;
  }

  const user = await updateSupabasePassword(password);
  // End the temporary recovery session. The user must authenticate again with the new password.
  await signOutSupabase();
  return user;
}
