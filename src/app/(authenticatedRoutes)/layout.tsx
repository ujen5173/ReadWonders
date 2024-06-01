import { type ReactNode } from "react";
import { PrefetchTRPCQuery } from "~/components/PrefetchTRPCQuery/PrefetchTRPCQuery";
import { PrivateRoute } from "~/components/PrivateRoute/PrivateRoute";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <PrivateRoute>
      <PrefetchTRPCQuery queryName="auth.getProfile">
        {children}
      </PrefetchTRPCQuery>
    </PrivateRoute>
  );
}
