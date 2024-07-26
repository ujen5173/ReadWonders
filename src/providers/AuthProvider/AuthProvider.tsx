"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { type Session, type User } from "@supabase/supabase-js";
import { supabase } from "~/server/supabase/supabaseClient";

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: false,
});

const setCookies = (session: Session | null) => {
  if (session) {
    const maxAge = 604800; // 7 days in seconds

    document.cookie = `access-token=${session.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
    document.cookie = `refresh-token=${session.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
  } else {
    const expires = new Date(0).toUTCString();

    document.cookie = `access-token=; path=/; expires=${expires}; SameSite=Lax; secure`;
    document.cookie = `refresh-token=; path=/; expires=${expires}; SameSite=Lax; secure`;
  }
};

export const AuthProvider = ({
  user: initialUser,
  session: initialSession,
  children,
}: {
  user: User | null;
  session: Session | null;
  children: ReactNode;
}) => {
  const [userSession, setUserSession] = useState<Session | null>(
    initialSession,
  );
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState(!initialUser);

  const refreshToken = useCallback(async () => {
    const { data, error } = await supabase().auth.refreshSession();

    if (error) {
      console.error("Error refreshing token:", error);

      return;
    }

    setUserSession(data.session);
    setUser(data.session?.user ?? null);
    setCookies(data.session);
  }, []);

  useEffect(() => {
    const updateSession = async () => {
      const {
        data: { session },
      } = await supabase().auth.getSession();

      setUserSession(session);
      setUser(session?.user ?? null);
      setCookies(session);
      setIsLoading(false);
    };

    void updateSession();

    const { data: authListener } = supabase().auth.onAuthStateChange(
      async (event, session) => {
        setUserSession(session);
        setUser(session?.user ?? null);
        setCookies(session);
        setIsLoading(false);

        if (event === "TOKEN_REFRESHED") {
          await refreshToken();
        }
      },
    );

    // Set up a timer to refresh the token before it expires
    const refreshInterval = setInterval(() => {
      void refreshToken();
    }, 3600000); // Refresh every hour (adjust as needed)

    return () => {
      authListener.subscription.unsubscribe();
      clearInterval(refreshInterval);
    };
  }, [refreshToken]);

  const value = {
    session: userSession,
    user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useUser = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a AuthContextProvider.");
  }

  return context;
};
