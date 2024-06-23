"use client";

import { Lightbulb, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { siteConfig } from "~/config/site";
import { cn } from "~/utils/cn";
import Logo from "../Logo";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const Footer = () => {
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  return (
    <footer className="w-full">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-8 px-4 py-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="grid-cols-2">
            <Link href="/" className="mb-4 mr-6 flex items-end gap-1">
              <Logo />
            </Link>
            <p className="text-text-light mb-2">{siteConfig.tagline}</p>
            <p className="text-text-light mb-4">{siteConfig.description}</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mb-5 gap-2">
                  <Lightbulb className="text-danger" size={18} />
                  <span>Any feedback?</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Give Feedback</DialogTitle>
                  <DialogDescription>
                    What do you think of our website? Let us know your thoughts.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex items-center gap-2">
                    {["Terrible", "Bad", "Okay", "Good", "Amazing"].map(
                      (rating) => (
                        <button
                          onClick={() => setSelectedEmoji(rating)}
                          key={rating}
                          className={cn(
                            "rounded-md border bg-white p-4 transition hover:bg-zinc-100",
                            selectedEmoji === rating
                              ? "border-primary/60 bg-primary/10"
                              : "border-border",
                          )}
                        >
                          <Image
                            src={`/feedback-icons/${rating.toLowerCase()}.svg`}
                            width={60}
                            height={60}
                            alt={rating}
                          />
                        </button>
                      ),
                    )}
                  </div>
                  <div className="">
                    <Label htmlFor="name" className="mb-2 block">
                      Response
                    </Label>
                    <Textarea
                      id="response"
                      required
                      ref={inputRef}
                      placeholder="Your feedback here..."
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Submit</Button>
                  <DialogClose asChild>
                    <Button type="button" variant={"secondary"}>
                      Cancel
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
              <Input
                className="text-md"
                type="email"
                placeholder="email@example.com"
              />
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
        <div className="w-full border-t border-border p-4">
          <p className="text-center text-text-secondary">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
