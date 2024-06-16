import { Github, Twitter } from "lucide-react";
import { Icons } from "~/components/Icons";
import { env } from "~/env.mjs";

const links = {
  github: "https://github.com/ujen5173/readwonders",
  twitter: "https://twitter.com/ujen_basi",
  linkedin: "https://www.linkedin.com/in/ujen-basi-167a4522a/",
  discord: "",
  authorsWebsite: "https://ujenbasi.vercel.app",
  authorsGitHub: "https://github.com/ujen5173",
  openGraphImage: env.NEXT_PUBLIC_APP_URL + "/og-image.png",
};

export const siteConfig = {
  name: "ReadWonders",
  namelower: "readwonders",
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
      title: "Stories Categories",
      links: [
        {
          name: "Romance",
          href: "/Romance",
        },
        {
          name: "Fantasy",
          href: "/Fantasy",
        },
        {
          name: "Young Adult",
          href: "/Young",
        },
        {
          name: "Science Fiction",
          href: "/Science",
        },
        {
          name: "Thriller/Mystery",
          href: "/Thriller",
        },
      ],
    },
    {
      title: "Important Links",
      links: [
        {
          name: "About",
          href: "/About",
        },
        {
          name: "Privacy Policy",
          href: "/Privacy Policy",
        },
        {
          name: "Terms & Conditions",
          href: "/Terms & Conditions",
        },
        {
          name: "Careers",
          href: "/Careers",
        },
        {
          name: "Creators",
          href: "/Creators",
        },
      ] as { name: string; href: string }[],
    },
  ],
  socials: [
    {
      name: "Buy me a Coffee",
      icon: <Icons.coffee className="size-7" />,
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
      icon: <Icons.productHunt className="size-8" />,
      href: links.linkedin,
    },
  ],
};
