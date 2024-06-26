"use client";

import { usePathname } from "next/navigation";
import { createContext, useState, type ReactNode } from "react";
import Footer from "~/components/sections/footer";
import Header from "~/components/sections/header";
import { type RootContextType, type TCard } from "~/types";

export const Context = createContext<RootContextType>({
  activeBook: null,
  setActiveBook: () => {},
});

const RootContext = ({ children }: { children: ReactNode }) => {
  const path = usePathname();

  const [activeBook, setActiveBook] = useState<TCard | null>(null);

  return (
    <Context.Provider value={{ activeBook, setActiveBook }}>
      {!path.includes("write/s/") && <Header />}
      {children}
      {!path.includes("write") && <Footer />}
    </Context.Provider>
  );
};

export default RootContext;
