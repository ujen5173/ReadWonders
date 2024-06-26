"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { type Session, type User } from "@supabase/supabase-js";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { supabase } from "~/server/supabase/supabaseClient";

export const AuthContext = createContext<{
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}>({
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

  useEffect(() => {
    void supabase()
      .auth.getSession()
      .then(({ data: { session } }) => {
        setUserSession(session);
        setUser(session?.user ?? null);
        setCookies(session);
        setIsLoading(false);
      });

    const { data: authListener } = supabase().auth.onAuthStateChange(
      (event, session) => {
        setUserSession(session);
        setUser(session?.user ?? null);
        setCookies(session);
        setIsLoading(false);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session: userSession,
    user,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <ReactQueryDevtools />
    </AuthContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("User must be used within a AuthContextProvider.");
  }

  return context;
};
