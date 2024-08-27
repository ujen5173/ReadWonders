import { redirect } from "next/navigation";
import { type ReactNode } from "react";
import { getServerAuthSession } from "~/server/auth";

const LandingPageLayout = async ({ children }: { children: ReactNode }) => {
  const user = await getServerAuthSession();

  if (user) redirect("/dashboard");

  return <>{children}</>;
};

export default LandingPageLayout;
