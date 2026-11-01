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
  sendSupabasePasswordReset,
  signInWithSupabaseEmail,
  signOutSupabase,
  signUpWithSupabaseEmail,
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

export async function requestPasswordReset(email) {
  if (getAuthBackend() === AUTH_BACKENDS.SUPABASE) {
    return sendSupabasePasswordReset(email, `${APP_URL}/login`);
  }

  return sendPasswordResetEmail(auth, email, { url: `${APP_URL}/login`, handleCodeInApp: false });
}
