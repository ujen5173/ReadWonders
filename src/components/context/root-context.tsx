"use client";

import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import { createContext, useMemo, useState, type ReactNode } from "react";
import { useUser } from "~/hooks/use-user";
import { api } from "~/trpc/react";
import type { RootContextType, TCard, User } from "~/types";
import Footer from "../shared/footer";
import Header from "../shared/header";

export const Context = createContext<RootContextType>({
  activeBook: null,
  setActiveBook: () => {
    // Do nothing
  },
  removeFromList: async () => false,
});

const RootContext = ({
  value,
  children,
}: {
  value: { user: User | null };
  children: ReactNode;
}) => {
  const path = usePathname();
  const { setUser } = useUser();

  useMemo(() => {
    setUser(value.user);
  }, [value.user, setUser]);

  const { mutateAsync } = api.story.removeReadingListStory.useMutation();

  const [activeBook, setActiveBook] = useState<TCard | null>(null);

  const removeFromList = async (id: string) => {
    const res = await mutateAsync({
      storyId: id,
    });

    return res;
  };

  return (
    <SessionProvider>
      <Context.Provider value={{ removeFromList, activeBook, setActiveBook }}>
        {!path.includes("/write/s/") &&
          !path.includes("/edit") &&
          !path.includes("/chapter") && <Header />}
        {children}
        {!path.includes("/write") && !path.includes("/edit") && <Footer />}
      </Context.Provider>
    </SessionProvider>
  );
};

export default RootContext;
