import { Metadata } from "next";
import { ReactNode } from "react";
import Footer from "~/components/sections/footer";
import { constructMetadata, siteConfig } from "~/config/site";

export const metadata: Metadata = constructMetadata({
  title: `All Genre - ${siteConfig.name}`,
  description: "Explore all genres available on the platform.",
  url: `${siteConfig.url}/genre`,
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
