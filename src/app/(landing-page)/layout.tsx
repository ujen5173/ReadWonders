import { type PropsWithChildren } from "react";
import Header from "~/components/sections/header";

const Layout = async ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="fixed -z-10 h-screen w-full bg-gradient-to-br from-blue-200 via-white to-blue-100"></div>
      <Header />
      {children}
    </>
  );
};

export default Layout;
