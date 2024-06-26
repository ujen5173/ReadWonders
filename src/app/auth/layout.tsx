import { Metadata } from "next";
import { type PropsWithChildren } from "react";
import { PublicRoute } from "~/components/PublicRoute/PublicRoute";
import { constructMetadata, getBaseUrl, siteConfig } from "~/config/site";

export const metadata: Metadata = constructMetadata({
  title: `Login - ${siteConfig.name}`,
  description: "Login to your account",
  url: `${getBaseUrl()}/auth/login`,
});

const Layout = async ({ children }: PropsWithChildren) => {
  return <PublicRoute>{children}</PublicRoute>;
};

export default Layout;
