import { Metadata } from "next";
import { type ReactNode } from "react";
import { PrivateRoute } from "~/components/PrivateRoute/PrivateRoute";
import { constructMetadata } from "~/config/site";

export const metadata: Metadata = constructMetadata({
  title: "Dashboard - Online Reading Platform",
});

export default function Layout({ children }: { children: ReactNode }) {
  return <PrivateRoute>{children}</PrivateRoute>;
}
