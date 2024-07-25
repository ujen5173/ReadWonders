import { type Metadata } from "next";
import { type PropsWithChildren } from "react";
import { constructMetadata, getBaseUrl, siteConfig } from "~/config/site";

export const metadata: Metadata = constructMetadata({
  title: `Login - ${siteConfig.name}`,
  description: "Login to your account",
  url: `${getBaseUrl()}/auth/login`,
});

const Layout = async ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};

export default Layout;
