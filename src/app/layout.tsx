import { type Metadata, type Viewport } from "next";
import { headers } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import { type ReactNode } from "react";
import { TailwindIndicator } from "~/components/TailwindIndicator";
import { Toaster } from "~/components/ui/toaster";
import { indexFont } from "~/config/font";
import { constructMetadata } from "~/config/site";
import { Providers } from "~/providers";
import { AuthProvider } from "~/providers/AuthProvider/AuthProvider";
import "~/styles/globals.css";
import { TRPCReactProvider } from "~/trpc/react";
import { getServerUser } from "~/utils/auth";
import { cn } from "~/utils/cn";
import Info from "./_components/Info";
import RootContext from "./_components/RootContext";

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
  const user = await getServerUser();

  return (
    <>
      <html lang="en">
        <head />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <body className={cn("min-h-screen antialiased", indexFont.className)}>
          <NextTopLoader height={5} color={"#e11d48"} />
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
          <TRPCReactProvider headers={headers()}>
            <AuthProvider {...user}>
              <RootContext>
                <Providers>
                  {sheet}
                  {modal}
                  {children}
                  <Toaster />
                </Providers>
              </RootContext>
            </AuthProvider>
          </TRPCReactProvider>
          <TailwindIndicator />
        </body>
      </html>
    </>
  );
}

export default RootLayout;
