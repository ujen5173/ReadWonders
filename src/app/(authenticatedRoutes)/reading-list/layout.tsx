import { Metadata } from "next";
import { ReactNode } from "react";
import Footer from "~/components/sections/footer";
import { constructMetadata, getBaseUrl, siteConfig } from "~/config/site";

export const metadata: Metadata = constructMetadata({
  title: `Reading List - ${siteConfig.name}`,
  url: `${getBaseUrl()}/reading-list`,
});

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <Footer />
    </>
  );
};

export default Layout;
