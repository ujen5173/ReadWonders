"use client";

import { type PropsWithChildren } from "react";
import { UmamiAnalyticsProvider } from "./AnalyticsProvider/AnalyticsProvider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <>
      {children}
      <UmamiAnalyticsProvider />
    </>
  );
}
