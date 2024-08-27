import { type Metadata } from "next";
import { type ReactNode } from "react";
import { constructMetadata } from "~/config/site";

export const metadata: Metadata = constructMetadata({
  title: "New Story - Online Reading Platform",
  description: "Write your story and share it with the world",
});

const layout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default layout;
