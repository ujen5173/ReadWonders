"use client";

import { type PropsWithChildren } from "react";
import { CSPostHogProvider } from "./AnalyticsProvider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <>
      <CSPostHogProvider>{children}</CSPostHogProvider>
    </>
  );
}
