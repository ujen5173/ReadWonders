import { type ReactNode } from "react";
import { PublicRoute } from "~/components/PublicRoute/PublicRoute";

const LandingPageRootLayout = ({ children }: { children: ReactNode }) => {
  return <PublicRoute>{children}</PublicRoute>;
};

export default LandingPageRootLayout;
