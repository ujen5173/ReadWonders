import { env } from "~/env.mjs";

const links = {
  github: "https://github.com/ujen5173/storynest",
  twitter: "https://twitter.com/ujen_basi",
  linkedin: "https://www.linkedin.com/in/ujen-basi-167a4522a/",
  discord: "",
  authorsWebsite: "https://ujenbasi.vercel.app",
  authorsGitHub: "https://github.com/ujen5173",
  openGraphImage: env.NEXT_PUBLIC_APP_URL + "/og-image.png",
};

export const siteConfig = {
  name: "Story Nest",
  description:
    "A dynamic community platform where creators can craft and share their stories, express their emotions, and connect with a supportive audience.",
  links,
  url: "https://storynest.vercel.app",
  ogImage: links.openGraphImage,
  author: "ujen5173",
  hostingRegion: "us-west-2",
  keywords: [
    "Online Reading Platform",
    "Free Stories and Books",
    "Self-Publishing",
    "Fanfiction Community",
    "Fiction Writing",
    "Read and Write Stories",
    "Story Sharing Platform",
    "Ebook Library",
    "Romance Novels Online",
    "Young Adult Fiction",
    "Interactive Storytelling",
    "Creative Writing Community",
    "Web Fiction",
  ],
  navItems: [],
  navItemsMobile: [],
  navItemsFooter: [],
};
