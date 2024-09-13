import { Github, Twitter } from "lucide-react";
import { type Metadata } from "next";
import { Icons } from "~/components/shared/Icons";
import { env } from "~/env.js";

const links = {
  github: "https://github.com/ujen5173/readwonders",
  twitter: "https://twitter.com/ujen_basi",
  linkedin: "https://www.linkedin.com/in/ujen-basi-167a4522a/",
  discord: "",
  authorsWebsite: "https://ujenbasi.vercel.app",
  authorsGitHub: "https://github.com/ujen5173",
  openGraphImage: env.NEXT_PUBLIC_APP_URL + "/og-image.png",
};

export function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  if (env.NEXT_PUBLIC_APP_URL) {
    return env.NEXT_PUBLIC_APP_URL;
  }

  return `http://localhost:3000`;
}

export const siteConfig = {
  name: "ReadWonders",
  namelower: "readwonders",
  title: "ReadWonders - Online Storytelling Platform",
  description:
    "A dynamic community platform where creators can craft and share their stories, express their emotions, and connect with a supportive audience.",
  tagline: "Empowering Voices, Inspiring Readers, One Chapter at a Time",
  links,
  url: "https://readwonders.vercel.app",
  ogImage: links.openGraphImage,
  author: "ujen5173",
  hostingRegion: "us-west-2",
  keywords: [
    "Online Reading Platform",
    "Free Stories",
    "Self-Publishing",
    "Fanfiction Community",
    "Fiction Writing",
    "Read and Write Stories",
    "Story Sharing Platform",
    "Estory Library",
    "Romance Novels Online",
    "Young Adult Fiction",
    "Interactive Storytelling",
    "Creative Writing Community",
    "Web Fiction",
  ],
  navItems: [],
  navItemsMobile: [],
  navItemsFooter: [
    {
      title: "Important Links",
      links: [
        {
          name: "Privacy Policy",
          href: "/privacy-policy",
        },
        {
          name: "Terms & Conditions",
          href: "/terms-and-condition",
        },
        {
          name: "Careers",
          href: "/careers",
        },
        {
          name: "Website Analytics",
          href: "/stats",
        },
      ] as { name: string; href: string }[],
    },
  ],
  socials: [
    {
      name: "Buy me a Coffee",
      icon: <Icons.coffee className="size-6" />,
      href: links.linkedin,
    },
    {
      name: "Twitter",
      icon: <Twitter />,
      href: links.twitter,
    },
    {
      name: "GitHub",
      icon: <Github />,
      href: links.github,
    },
    {
      name: "ProductHunt",
      icon: <Icons.productHunt className="size-6" />,
      href: links.linkedin,
    },
  ],
  verification: {
    google: "7I8etOlMn025RLfRGGDr9Xz59ht_vzxdiaGsnxu-g_0",
  },
};
export function constructMetadata({
  title = siteConfig.title,
  description = siteConfig.description,
  image = `${getBaseUrl()}/og-image.png`,
  icons = [
    {
      rel: "apple-touch-icon",
      sizes: "32x32",
      url: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png",
    },
  ],
  noIndex = false,
  url = getBaseUrl(),
  publishedTime,
}: {
  title?: string;
  description?: string;
  image?: string | null;
  icons?: Metadata["icons"];
  noIndex?: boolean;
  url?: string;
  publishedTime?: string;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      publishedTime,
      ...(image && {
        images: [
          {
            url: image,
          },
        ],
      }),
    },
    twitter: {
      title,
      description,
      ...(image && {
        card: "summary_large_image",
        images: [image],
      }),
      creator: "ujen_basi",
    },
    icons,
    metadataBase: new URL(getBaseUrl()),
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
  };
}
