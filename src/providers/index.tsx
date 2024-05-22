"use client";

import { type PropsWithChildren } from "react";
import { UmamiAnalyticsProvider } from "./AnalyticsProvider/AnalyticsProvider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <>
      {/* <ThemeProvider attribute="class" forcedTheme="red"> */}
      {children}
      {/* </ThemeProvider> */}
      <UmamiAnalyticsProvider />
    </>
  );
}
