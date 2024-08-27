import { type Metadata } from "next";
import { type ReactNode } from "react";
import { constructMetadata, siteConfig } from "~/config/site";

export const metadata: Metadata = constructMetadata({
  title: `All Genre - ${siteConfig.name}`,
  description: "Explore all genres available on the platform.",
  url: `${siteConfig.url}/genre`,
});

const Layout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
