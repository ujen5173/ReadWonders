"use client";

import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import Header from "~/components/sections/header";

const RootContext = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  return (
    <div>
      {!pathname.startsWith("/write") && <Header />}

      {children}
    </div>
  );
};

export default RootContext;
