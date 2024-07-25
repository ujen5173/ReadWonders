import { ReactNode } from "react";
import LayoutWrapper from "./LayoutWrapper";

const Layout = ({ children }: { children: ReactNode }) => {
  return <LayoutWrapper>{children}</LayoutWrapper>;
};

export default Layout;
