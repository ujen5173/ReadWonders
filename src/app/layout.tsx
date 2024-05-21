import { type Metadata, type Viewport } from "next";
import { headers } from "next/headers";
import { TailwindIndicator } from "~/components/TailwindIndicator";
import { Toaster } from "~/components/ui/toaster";
import { fontInter } from "~/config/font";
import { siteConfig } from "~/config/site";
import { env } from "~/env.mjs";
import { Providers } from "~/providers";
import { AuthProvider } from "~/providers/AuthProvider/AuthProvider";
import "~/styles/globals.css";
import { TRPCReactProvider } from "~/trpc/react";
import { getServerUser } from "~/utils/auth";
import { cn } from "~/utils/cn";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 6,
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "white" }],
};

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [
    {
      name: siteConfig.author,
      url: siteConfig.links.authorsWebsite,
    },
  ],
  creator: siteConfig.author,
  keywords: siteConfig.keywords,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      "max-image-preview": "large",
      "max-snippet": -1,
      follow: true,
      index: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.links.openGraphImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} Open Graph Image`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.links.openGraphImage],
    creator: siteConfig.author,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();

  return (
    <>
      <html lang="en">
        <head />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <body
          className={cn(
            "min-h-screen font-sans antialiased",
            fontInter.className,
          )}
        >
          <TRPCReactProvider headers={headers()}>
            <AuthProvider {...user}>
              <Providers>
                {children}
                <Toaster />
              </Providers>
            </AuthProvider>
          </TRPCReactProvider>
          <TailwindIndicator />
        </body>
      </html>
    </>
  );
}

export default RootLayout;
