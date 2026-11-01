/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebaseConfig/firebaseCore";
import { AUTH_BACKENDS, getAuthBackend } from "../features/auth/authBackend";
import { getSupabaseSession, signOutSupabase, subscribeToSupabaseAuth } from "../features/auth/supabaseAuthAdapter";
import { getCurrentProfile } from "../features/auth/repositories/supabaseProfileRepository";
import { normalizeFirebaseUser, normalizeSupabaseUser } from "../features/auth/sessionModel";
import { ROLES } from "../app/routePolicy";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const backend = getAuthBackend();

  useEffect(() => {
    localStorage.removeItem("rememberedPassword");
    let active = true;

    const applySupabaseSession = async (session) => {
      if (!active) return;
      const normalized = normalizeSupabaseUser(session?.user);
      setUser(normalized);
      if (!normalized) {
        setProfile(null);
        setLoading(false);
        return;
      }
      try {
        const trustedProfile = await getCurrentProfile();
        if (active) setProfile(trustedProfile);
      } catch (error) {
        console.error("Profile hydration error:", error);
        if (active) setProfile(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    if (backend === AUTH_BACKENDS.SUPABASE) {
      getSupabaseSession().then(applySupabaseSession).catch((error) => {
        console.error("Supabase auth hydration error:", error);
        if (active) { setUser(null); setProfile(null); setLoading(false); }
      });
      const unsubscribe = subscribeToSupabaseAuth(applySupabaseSession);
      return () => { active = false; unsubscribe(); };
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!active) return;
      setUser(normalizeFirebaseUser(currentUser));
      // Transitional V1 users have no trusted role store. Never elevate them client-side.
      setProfile(currentUser ? { role: ROLES.STUDENT } : null);
      setLoading(false);
    }, (error) => {
      console.error("Firebase auth state error:", error);
      if (active) { setUser(null); setProfile(null); setLoading(false); }
    });

    return () => { active = false; unsubscribe(); };
  }, [backend]);

  const logout = async () => {
    try {
      if (backend === AUTH_BACKENDS.SUPABASE) await signOutSupabase();
      else await signOut(auth);
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
      localStorage.removeItem("rememberMe");
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: "Unable to sign out. Please try again." };
    }
  };

  const value = useMemo(() => ({
    user,
    profile,
    role: profile?.role || null,
    campus: profile?.campuses || null,
    backend,
    isAuthenticated: Boolean(user),
    isEmailVerified: Boolean(user?.emailVerified),
    loading,
    logout,
  }), [user, profile, loading, backend]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
