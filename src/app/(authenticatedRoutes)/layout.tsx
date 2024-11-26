"use client";

import { type ReactNode } from "react";
import { withPrivateRoute } from "~/providers/AuthProvider/withPrivateRoute";

const Layout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default withPrivateRoute(Layout);
