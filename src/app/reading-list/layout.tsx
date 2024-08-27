import { type Metadata } from "next";
import { type ReactNode } from "react";
import { constructMetadata, getBaseUrl, siteConfig } from "~/config/site";

export const metadata: Metadata = constructMetadata({
  title: `Reading List - ${siteConfig.name}`,
  url: `${getBaseUrl()}/reading-list`,
});

const Layout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
