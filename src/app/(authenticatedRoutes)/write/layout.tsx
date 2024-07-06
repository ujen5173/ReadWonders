import { type Metadata } from "next";
import { ReactNode } from "react";
import { constructMetadata } from "~/config/site";

export const metadata: Metadata = constructMetadata({
  title: "New Story - Online Reading Platform",
});

const layout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default layout;
