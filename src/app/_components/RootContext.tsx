"use client";

import { usePathname } from "next/navigation";
import { createContext, useState, type ReactNode } from "react";
import Footer from "~/components/sections/footer";
import Header from "~/components/sections/header";
import { api } from "~/trpc/react";
import type { RootContextType, TCard } from "~/types";

export const Context = createContext<RootContextType>({
  activeBook: null,
  setActiveBook: () => {},
  removeFromList: async () => false,
});

const RootContext = ({ children }: { children: ReactNode }) => {
  const path = usePathname();
  const { mutateAsync } = api.story.removeReadingListStory.useMutation();

  const [activeBook, setActiveBook] = useState<TCard | null>(null);

  const removeFromList = async (id: string) => {
    const res = await mutateAsync({
      storyId: id,
    });

    return res;
  };

  return (
    <Context.Provider value={{ removeFromList, activeBook, setActiveBook }}>
      {!path.includes("/write/s/") && !path.includes("/edit") && <Header />}
      {children}
      {!path.includes("/write") && !path.includes("/edit") && <Footer />}
    </Context.Provider>
  );
};

export default RootContext;
