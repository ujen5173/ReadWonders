import { Idea01Icon, SentIcon } from "hugeicons-react";
import Link from "next/link";
import { siteConfig } from "~/config/site";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Logo from "./Logo";
import FeedbackDialog from "./feedback";

const data = [
  {
    id: "1",
    name: "Adventure",
    slug: "adventure",
  },
  {
    id: "2",
    name: "Fanfiction",
    slug: "fanfiction",
  },
  {
    id: "3",
    name: "Fantasy",
    slug: "fantasy",
  },
  {
    id: "4",
    name: "Historical Fiction",
    slug: "historical-fiction",
  },
  {
    id: "5",
    name: "Horror",
    slug: "horror",
  },
];

const Footer = () => {
  return (
    <footer className="w-full">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-8 px-4 py-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="grid-cols-2">
            <Link href="/" className="mb-4 mr-6 flex w-fit items-end gap-1">
              <Logo />
            </Link>
            <p className="text-text-light mb-2 text-sm">{siteConfig.tagline}</p>
            <p className="text-text-light mb-4 text-sm">
              {siteConfig.description}
            </p>
            <FeedbackDialog>
              <Button className="mb-5 gap-2">
                <Idea01Icon className="text-danger" size={18} />
                <span className="text-sm">Any feedback?</span>
              </Button>
            </FeedbackDialog>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex-1">
              <h1 className="mb-2 text-base font-semibold text-slate-800">
                Stories Categories
              </h1>
              <ul>
                {data.map((genre) => (
                  <li key={genre.id}>
                    <Link
                      href={`/genre/${genre.slug}`}
                      className="text-text-light inline-block py-1 text-sm hover:text-slate-800 hover:underline"
                    >
                      {genre.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {siteConfig.navItemsFooter.map((navItem) => (
              <div key={navItem.title} className="flex-1">
                <h1 className="mb-2 text-base font-semibold text-slate-800">
                  {navItem.title}
                </h1>
                <ul>
                  {navItem.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-text-light inline-block py-1 text-sm hover:text-slate-800 hover:underline"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex-1">
            <h1 className="text-text-primary mb-2 text-base font-semibold">
              Want to be updated?
            </h1>
            <p className="text-text-light mb-4 text-sm">
              Subscribe to our newsletter for the latest updates and promotions.
            </p>
            <form className="mb-4 flex items-center gap-2" action="">
              <Input
                className="text-sm"
                type="email"
                placeholder="email@example.com"
              />
              <Button>
                <SentIcon size={18} />
              </Button>
            </form>
            <div className="flex items-center">
              {siteConfig.socials.map((social) => (
                <TooltipProvider key={social.name} delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Link
                        href={social.href}
                        className="flex size-12 items-center justify-center rounded-lg border border-transparent hover:border-border hover:bg-slate-50"
                      >
                        {social.icon}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{social.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full border-t border-border p-4">
          <p className="text-text-secondary text-center text-sm">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
