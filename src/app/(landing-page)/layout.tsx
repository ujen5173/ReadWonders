import { type PropsWithChildren } from "react";
import Footer from "~/components/sections/footer";
import Header from "~/components/sections/header";

const Layout = async ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="fixed -z-10 h-screen w-full bg-gradient-to-br from-primary/20 via-white to-primary/10"></div>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
