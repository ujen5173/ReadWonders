import { ReactNode } from "react";
import Footer from "~/components/sections/footer";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <Footer />
    </>
  );
};

export default Layout;
