import { redirect } from "next/navigation";
import { type PropsWithChildren } from "react";
import { api } from "~/trpc/server";
import { PrivateRouteBase } from "./PrivateRouteBase";

export const PrivateRoute = async ({ children }: PropsWithChildren) => {
  try {
    const user = await api.auth.getProfile.query();

    if (!user) redirect("/auth/login");
  } catch (err) {
    redirect("/auth/login");
  }

  return <PrivateRouteBase>{children}</PrivateRouteBase>;
};
