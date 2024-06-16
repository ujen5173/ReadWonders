import { type ReactNode } from "react";
import { PrivateRoute } from "~/components/PrivateRoute/PrivateRoute";

export default function Layout({ children }: { children: ReactNode }) {
  return <PrivateRoute>{children}</PrivateRoute>;
}
