"use client";

import { usePathname } from "next/navigation";
import { createContext, useState, type ReactNode } from "react";
import Header from "~/components/sections/header";
import { type RootContextType, type TCard } from "~/types";

export const Context = createContext<RootContextType>({
  activeBook: null,
  setActiveBook: () => {},
});

const RootContext = ({ children }: { children: ReactNode }) => {
  const path = usePathname();
  console.log({ path });
  const [activeBook, setActiveBook] = useState<TCard | null>(null);

  return (
    <Context.Provider value={{ activeBook, setActiveBook }}>
      {!path.includes("write/s/") && <Header />}
      {children}
    </Context.Provider>
  );
};

export default RootContext;
