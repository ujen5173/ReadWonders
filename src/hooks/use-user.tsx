"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { type User } from "~/types";

export type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const Context = createContext<UserContextType>({
  user: null,
  setUser: () => {
    // Do nothing
  },
});

const UserContext = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <Context.Provider value={{ user, setUser }}>{children}</Context.Provider>
  );
};

export default UserContext;

export const useUser = () => {
  const { user, setUser } = useContext(Context);

  return { user, setUser };
};
