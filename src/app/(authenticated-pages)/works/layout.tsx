import { Metadata } from "next";
import { ReactNode } from "react";
import { constructMetadata } from "~/config/site";

export const metadata: Metadata = constructMetadata({
  title: "Works - ReadWonders",
  description: "Explore and read stories from our community",
});

const Layout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
