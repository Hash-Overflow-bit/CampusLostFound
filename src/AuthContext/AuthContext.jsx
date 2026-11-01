/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebaseConfig/firebaseCore";
import { AUTH_BACKENDS, getAuthBackend } from "../features/auth/authBackend";
import {
  getSupabaseSession,
  signOutSupabase,
  subscribeToSupabaseAuth,
} from "../features/auth/supabaseAuthAdapter";
import {
  normalizeFirebaseUser,
  normalizeSupabaseUser,
} from "../features/auth/sessionModel";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const backend = getAuthBackend();

  useEffect(() => {
    localStorage.removeItem("rememberedPassword");

    if (backend === AUTH_BACKENDS.SUPABASE) {
      let active = true;

      getSupabaseSession()
        .then((session) => {
          if (active) setUser(normalizeSupabaseUser(session?.user));
        })
        .catch((error) => {
          console.error("Supabase auth hydration error:", error);
          if (active) setUser(null);
        })
        .finally(() => {
          if (active) setLoading(false);
        });

      const unsubscribe = subscribeToSupabaseAuth((session) => {
        if (!active) return;
        setUser(normalizeSupabaseUser(session?.user));
        setLoading(false);
      });

      return () => {
        active = false;
        unsubscribe();
      };
    }

    return onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(normalizeFirebaseUser(currentUser));
        setLoading(false);
      },
      (error) => {
        console.error("Firebase auth state error:", error);
        setUser(null);
        setLoading(false);
      }
    );
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
      return { success: false, error: error.message };
    }
  };

  const value = useMemo(
    () => ({
      user,
      backend,
      isAuthenticated: Boolean(user),
      isEmailVerified: Boolean(user?.emailVerified),
      loading,
      logout,
    }),
    [user, loading, backend]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
