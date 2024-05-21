"use client";

import { ThemeProvider } from "next-themes";
import { type PropsWithChildren } from "react";
import { UmamiAnalyticsProvider } from "./AnalyticsProvider/AnalyticsProvider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <>
      <ThemeProvider attribute="class" forcedTheme="light">
        {children}
      </ThemeProvider>
      <UmamiAnalyticsProvider />
    </>
  );
}
