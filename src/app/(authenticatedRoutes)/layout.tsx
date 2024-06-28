import { Metadata } from "next";
import { ReactNode } from "react";
import { PrivateRoute } from "~/components/PrivateRoute/PrivateRoute";
import { constructMetadata } from "~/config/site";

export const metadata: Metadata = constructMetadata({
  title: "Dashboard - ReadWonders.",
});

export default function Layout({ children }: { children: ReactNode }) {
  return <PrivateRoute>{children}</PrivateRoute>;
}
