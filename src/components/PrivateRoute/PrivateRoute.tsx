import { redirect } from "next/navigation";
import { type PropsWithChildren } from "react";
import { getServerUser } from "~/utils/auth";
import { PrivateRouteBase } from "./PrivateRouteBase";

export const PrivateRoute = async ({ children }: PropsWithChildren) => {
  const user = await getServerUser();

  if (!user) {
    redirect("/404");
  }

  return <PrivateRouteBase>{children}</PrivateRouteBase>;
};
