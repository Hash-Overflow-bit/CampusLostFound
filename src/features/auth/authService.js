import { auth } from "../../firebaseConfig/firebaseCore";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
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

const APP_URL = "https://campuslostfound.vercel.app";

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
    return signUpWithSupabaseEmail(email, password, metadata);
  }

  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName: fullName });
  await sendEmailVerification(result.user, { url: `${APP_URL}/login`, handleCodeInApp: false });
  await signOut(auth);
  return { user: result.user };
}

export async function resendConfirmation(email) {
  if (getAuthBackend() === AUTH_BACKENDS.SUPABASE) {
    return resendSupabaseConfirmation(email, `${APP_URL}/login`);
  }

  // Firebase requires the unverified user to be authenticated to resend safely.
  // Do not ask the browser to retain or replay the signup password. The user can
  // sign in again and the login flow can offer resend from that authenticated state.
  const error = new Error("Sign in again to resend your confirmation email.");
  error.code = "auth/reauth-required";
  throw error;
}

export async function requestPasswordReset(email) {
  if (getAuthBackend() === AUTH_BACKENDS.SUPABASE) {
    return sendSupabasePasswordReset(email, `${APP_URL}/update-password`);
  }

  return sendPasswordResetEmail(auth, email, { url: `${APP_URL}/login`, handleCodeInApp: false });
}

export async function setNewPassword(password) {
  if (getAuthBackend() === AUTH_BACKENDS.SUPABASE) return updateSupabasePassword(password);
  if (!auth.currentUser) throw new Error("Password recovery session is missing or expired.");
  return updatePassword(auth.currentUser, password);
}
