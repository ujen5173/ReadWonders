// supabaseClient.tsx

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { env } from "~/env.mjs";
import { type Database } from "./supabaseTypes";

export const getServiceSupabase = () =>
  createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_KEY,
    {
      auth: {
        detectSessionInUrl: true,
      },
    },
  );

export const clientSupabase = createClient<Database>(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

// Updated function for client-side Supabase client
export const createClientSideSupabase = () => {
  const supabase = createClientComponentClient<Database>();

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "TOKEN_REFRESHED" && session) {
      // Instead of setCookies, we'll update the access token in localStorage
      // This is automatically handled by the Supabase client, but we can add additional logic if needed
      console.log("Token refreshed");
    }
  });

  return supabase;
};

export const supabase = () =>
  typeof window === "undefined"
    ? getServiceSupabase()
    : createClientSideSupabase();

export const getUserAsAdmin = async (token: string) => {
  const { data, error } = await getServiceSupabase().auth.getUser(token);

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
};
