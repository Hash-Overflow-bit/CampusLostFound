/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSupabaseSession, signOutSupabase, subscribeToSupabaseAuth } from "../features/auth/supabaseAuthAdapter";
import { getCurrentProfile, onboardCurrentUserCampus } from "../features/auth/repositories/supabaseProfileRepository";
import { normalizeSupabaseUser } from "../features/auth/sessionModel";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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
        let trustedProfile = await getCurrentProfile();
        if (normalized.emailVerified && !trustedProfile?.campus_id) {
          trustedProfile = await onboardCurrentUserCampus();
        }
        if (active) setProfile(trustedProfile);
      } catch (error) {
        console.error("Profile/campus hydration error:", error);
        if (active) setProfile(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    getSupabaseSession().then(applySupabaseSession).catch((error) => {
      console.error("Supabase auth hydration error:", error);
      if (active) {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    const unsubscribe = subscribeToSupabaseAuth(applySupabaseSession);
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await signOutSupabase();
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
    backend: "supabase",
    isAuthenticated: Boolean(user),
    isEmailVerified: Boolean(user?.emailVerified),
    hasTrustedCampus: Boolean(profile?.campus_id),
    loading,
    logout,
  }), [user, profile, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
