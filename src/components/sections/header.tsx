"use client";

import { Menu, Plus } from "lucide-react";
import Link from "next/link";
import { fontUrbanist } from "~/config/font";
import { siteConfig } from "~/config/site";
import { cn } from "~/utils/cn";
import { Button, buttonVariants } from "../ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

const Header = () => {
  return (
    <header className="w-full">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="block md:hidden">
            <MobileMenu />
          </div>

          <h1
            className={cn(
              `${fontUrbanist.className} text-xl font-bold text-text-primary`,
            )}
          >
            {siteConfig.name}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/">
            <Button className="hidden gap-2 sm:flex" variant="ghost-link">
              <Plus size={18} />
              <span>Write a book</span>
            </Button>
          </Link>
          <Link href="/" className="hidden md:inline">
            <Button className="gap-2" variant="link">
              <span>Newsletter</span>
            </Button>
          </Link>
          <Link href="/" className="hidden md:inline">
            <Button className="gap-2" variant="link">
              <span>Stats</span>
            </Button>
          </Link>

          <div className="hidden">
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-white" asChild>
                <Button variant="outline" size="sm">
                  <span className="sr-only">Toggle theme</span>
                  <span className="text-sm">Change Theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() => {
                    document.documentElement.setAttribute("data-theme", "red");
                  }}
                >
                  Red
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() => {
                    document.documentElement.setAttribute("data-theme", "cyan");
                  }}
                >
                  Cyan
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() => {
                    document.documentElement.setAttribute(
                      "data-theme",
                      "orange",
                    );
                  }}
                >
                  Orange
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() => {
                    document.documentElement.setAttribute(
                      "data-theme",
                      "purple",
                    );
                  }}
                >
                  Purple
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Link href="/login">
            <Button variant="default">Login</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;

const MobileMenu = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <div className={buttonVariants({ size: "icon", variant: "outline" })}>
          <Menu size={18} />
        </div>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="mb-4">
            <h1
              className={cn(
                `${fontUrbanist.className} text-left text-xl font-bold text-text-primary`,
              )}
            >
              {siteConfig.name}
            </h1>
          </SheetTitle>
        </SheetHeader>

        <ul className="flex-1">
          <li>
            <Link href="/">
              <span className="block rounded-md px-4 py-2 text-left hover:bg-primary/10">
                Home
              </span>
            </Link>
          </li>
          <li>
            <Link href="/">
              <span className="block rounded-md px-4 py-2 text-left hover:bg-primary/10">
                Books
              </span>
            </Link>
          </li>
          <li>
            <Link href="/">
              <span className="block rounded-md px-4 py-2 text-left hover:bg-primary/10">
                Audio
              </span>
            </Link>
          </li>
          <li>
            <Link href="/">
              <span className="block rounded-md px-4 py-2 text-left hover:bg-primary/10">
                Newsletter
              </span>
            </Link>
          </li>
          <li>
            <Link href="/">
              <span className="block rounded-md px-4 py-2 text-left hover:bg-primary/10">
                Stats
              </span>
            </Link>
          </li>
        </ul>

        <div className="flex flex-col gap-4">
          <Link href="/">
            <Button className="w-full gap-2" variant="ghost-link">
              <Plus size={18} />
              <span>Write a book</span>
            </Button>
          </Link>{" "}
          <Link href="/login">
            <Button className="w-full" variant="default">
              Login
            </Button>
          </Link>{" "}
        </div>
      </SheetContent>
    </Sheet>
  );
};
