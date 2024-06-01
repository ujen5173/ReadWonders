import { Lightbulb, Send } from "lucide-react";
import Link from "next/link";
import { fontUrbanist } from "~/config/font";
import { siteConfig } from "~/config/site";
import { cn } from "~/utils/cn";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const Footer = () => {
  return (
    <footer className="w-full">
      <div className="container grid grid-cols-1 gap-8 px-4 py-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="grid-cols-2">
          <h1
            className={cn(
              `${fontUrbanist.className} mb-4 text-2xl font-bold text-text-primary`,
            )}
          >
            {siteConfig.name}
          </h1>
          <p className="text-text-light mb-2">{siteConfig.tagline}</p>
          <p className="text-text-light mb-4">{siteConfig.description}</p>

          <Button className="mb-5 gap-2">
            <Lightbulb className="text-danger" size={18} />
            <span>Any feedback?</span>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {siteConfig.navItemsFooter.map((navItem) => (
            <div key={navItem.title} className=" flex-1">
              <h1 className="mb-2 text-lg font-semibold text-slate-800">
                {navItem.title}
              </h1>
              <ul>
                {navItem.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-text-light inline-block py-1 hover:text-slate-800 hover:underline"
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
          <h1 className="mb-2 text-xl font-semibold text-text-primary">
            Want to be updated?
          </h1>
          <p className="text-text-light mb-4">
            Subscribe to our newsletter for the latest updates and promotions.
          </p>
          <form className="mb-4 flex items-center gap-2" action="">
            <Input className="text-md" placeholder="email@example.com" />
            <Button>
              <Send size={18} />
            </Button>
          </form>
          <div className="flex items-center gap-2">
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

      <div className="container border-t border-border p-4">
        <p className="text-center text-text-secondary">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All Rights
          Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
