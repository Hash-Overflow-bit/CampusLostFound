/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getSupabaseSession, signOutSupabase, subscribeToSupabaseAuth } from "../features/auth/supabaseAuthAdapter";
import { getCurrentProfile, onboardCurrentUserCampus } from "../features/auth/repositories/supabaseProfileRepository";
import { normalizeSupabaseUser } from "../features/auth/sessionModel";
import { clearProfileCache, readProfileCache } from "../features/auth/profileCache";
import { queueBackgroundTask } from "../features/auth/backgroundTaskQueue";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const hydrationVersion = useRef(0);

  useEffect(() => {
    localStorage.removeItem("rememberedPassword");
    let active = true;

    const applySupabaseSession = async (session, event = "INITIAL_SESSION") => {
      const version = ++hydrationVersion.current;
      if (!active) return;

      const normalized = normalizeSupabaseUser(session?.user);
      setUser(normalized);

      if (!normalized) {
        if (event === "SIGNED_OUT") clearProfileCache();
        setProfile(null);
        setLoading(false);
        return;
      }

      const cached = readProfileCache(normalized.id);
      if (cached?.profile) {
        setProfile(cached.profile);
        setLoading(false);
      } else {
        setLoading(true);
      }

      const hydrateProfile = async (force = false) => {
        try {
          let trustedProfile = await getCurrentProfile({ userId: normalized.id, force });
          if (normalized.emailVerified && !trustedProfile?.campus_id) {
            trustedProfile = await onboardCurrentUserCampus({ userId: normalized.id });
          }
          if (active && version === hydrationVersion.current) setProfile(trustedProfile);
        } catch (error) {
          console.error("Profile/campus hydration error:", error);
          if (active && version === hydrationVersion.current && !cached?.profile) setProfile(null);
        } finally {
          if (active && version === hydrationVersion.current) setLoading(false);
        }
      };

      // A missing campus after email verification is authorization-critical for the app flow,
      // so hydrate it immediately. Otherwise, use cached presentation data and revalidate stale
      // profiles in a non-blocking background task.
      if (!cached?.profile || (normalized.emailVerified && !cached.profile.campus_id)) {
        await hydrateProfile(Boolean(cached?.profile));
      } else if (!cached.isFresh) {
        queueBackgroundTask(`auth-profile:${normalized.id}`, () => hydrateProfile(true)).catch((error) => {
          console.error("Background profile refresh error:", error);
        });
      }
    };

    getSupabaseSession().then((session) => applySupabaseSession(session, "INITIAL_SESSION")).catch((error) => {
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
      const currentUserId = user?.id;
      await signOutSupabase();
      clearProfileCache(currentUserId);
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
