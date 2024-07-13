"use client";

import { Idea01Icon, SentIcon } from "hugeicons-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { siteConfig } from "~/config/site";
import { api } from "~/trpc/react";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { toast } from "../ui/use-toast";

const Footer = () => {
  const [selectedEmoji, setSelectedEmoji] = useState<
    "bad" | "good" | "amazing" | "okay" | "terrible"
  >("okay");

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const { mutateAsync, isLoading } = api.feedback.send.useMutation();
  const [from, setFrom] = useState<
    "github" | "twitter" | "none" | "google" | "friends" | undefined
  >();

  const onSubmit = async () => {
    const response = inputRef.current?.value;

    if (!response || !selectedEmoji) return;

    const res = await mutateAsync({
      rating: selectedEmoji,
      feedback: response,
      from,
    });

    if (res) {
      toast({ title: "Feedback submitted successfully!" });
    } else {
      toast({ title: "An error occurred. Please try again later." });
    }
  };

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
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mb-5 gap-2">
                  <Idea01Icon className="text-danger" size={18} />
                  <span className="text-sm">Any feedback?</span>
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
                  <Select
                    defaultValue="none"
                    onValueChange={(value) =>
                      setFrom(
                        value as
                          | "github"
                          | "twitter"
                          | "none"
                          | "google"
                          | "friends"
                          | undefined,
                      )
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Where did you hear us?" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectGroup>
                        <SelectLabel>Where did you hear us?</SelectLabel>
                        {["github", "twitter", "none", "google", "friends"].map(
                          (f) => (
                            <SelectItem key={f} value={f}>
                              {f.charAt(0).toUpperCase() + f.slice(1)}
                            </SelectItem>
                          ),
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-2">
                    {["Terrible", "Bad", "Okay", "Good", "Amazing"].map(
                      (rating) => (
                        <button
                          onClick={() =>
                            setSelectedEmoji(
                              rating.toLowerCase() as
                                | "bad"
                                | "good"
                                | "amazing"
                                | "okay"
                                | "terrible",
                            )
                          }
                          key={rating}
                          className={cn(
                            "rounded-md border bg-white p-4 transition hover:bg-zinc-100",
                            selectedEmoji === rating.toLowerCase()
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
                <DialogFooter className="gap-2">
                  <Button
                    disabled={isLoading}
                    loading={isLoading}
                    onClick={onSubmit}
                  >
                    Submit
                  </Button>
                  <DialogClose asChild>
                    <Button
                      disabled={isLoading}
                      type="button"
                      variant={"secondary"}
                    >
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
            <h1 className="mb-2 text-base font-semibold text-text-primary">
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
          <p className="text-center text-sm text-text-secondary">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
