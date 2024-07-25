"use client";
import { type ReactNode } from "react";
import { withPublicRoute } from "~/providers/AuthProvider/withPublicRoute";

const LandingPageRootLayout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default withPublicRoute(LandingPageRootLayout);
