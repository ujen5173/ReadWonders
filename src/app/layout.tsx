import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata, type Viewport } from "next";
import NextTopLoader from "nextjs-toploader";
import { type ReactNode } from "react";
import RootContext from "~/components/context/root-context";
import { Providers } from "~/components/providers";
import Info from "~/components/shared/Info";
import { constructMetadata } from "~/config/site";
import UserContext from "~/hooks/use-user";
import { getServerAuthSession } from "~/server/auth";
import { TRPCReactProvider } from "~/trpc/react";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 6,
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "white" }],
};

export const metadata: Metadata = constructMetadata();

async function RootLayout({
  sheet,
  modal,
  children,
}: {
  sheet: ReactNode;
  modal: ReactNode;
  children: ReactNode;
}) {
  const session = await getServerAuthSession();
  const user = session?.user ?? null;

  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <NextTopLoader height={5} color="#e11d48" />
        <div className="fixed -z-10 h-screen w-full bg-gradient-to-br from-primary/20 via-white to-primary/10"></div>
        <div
          className="fixed -z-10 h-screen w-full opacity-30"
          style={{
            backgroundImage: "url(/ooorganize.svg)",
            backgroundBlendMode: "overlay",
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
          }}
        ></div>
        <Info />

        <TRPCReactProvider>
          <UserContext>
            <RootContext value={{ user }}>
              <Providers>
                {sheet}
                {modal}
                {children}
              </Providers>
            </RootContext>
          </UserContext>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
export default RootLayout;
