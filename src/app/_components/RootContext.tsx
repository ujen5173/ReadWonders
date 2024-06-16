"use client";

import { createContext, useState, type ReactNode } from "react";
import Header from "~/components/sections/header";
import { type RootContextType, type TCard } from "~/types";

export const Context = createContext<RootContextType>({
  activeBook: null,
  setActiveBook: () => {},
});

const RootContext = ({ children }: { children: ReactNode }) => {
  const [activeBook, setActiveBook] = useState<TCard | null>(null);

  return (
    <Context.Provider value={{ activeBook, setActiveBook }}>
      <Header />

      {children}
    </Context.Provider>
  );
};

export default RootContext;
