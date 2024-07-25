"use client";

import { ReactNode } from "react";
import { withPrivateRoute } from "~/providers/AuthProvider/withPrivateRoute";

const LayoutWrapper = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default withPrivateRoute(LayoutWrapper);
