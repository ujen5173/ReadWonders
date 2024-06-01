"use client";

import { Menu, Plus } from "lucide-react";
import Link from "next/link";
import { fontUrbanist } from "~/config/font";
import { siteConfig } from "~/config/site";
import { cn } from "~/utils/cn";
import { Button, buttonVariants } from "../../ui/button";

import Image from "next/image";
import { Input } from "~/components/ui/input";
import { useUser } from "~/providers/AuthProvider/AuthProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../ui/sheet";

const Header = () => {
  const { user } = useUser();

  return (
    <header className="w-full">
      <div className="container flex items-center justify-between gap-4 px-4 py-2">
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

        <div className="flex flex-1 items-center justify-end gap-4">
          <form className="w-4/12">
            <Input placeholder="Search a book..." />
          </form>

          <Link href="/">
            <Button className="hidden gap-2 sm:flex">
              <Plus size={18} />
              <span>Write a book</span>
            </Button>
          </Link>

          <div className="">
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

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="rounded">
                  <span className="sr-only">Open user menu</span>
                  <Image
                    src={user.user_metadata.picture}
                    alt={user.user_metadata.name + "Profile"}
                    width={120}
                    height={120}
                    className="size-8 rounded-full object-cover"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[250px] bg-white" align="end">
                <DropdownMenuItem className="pointer-events-none cursor-default rounded-none border-b border-border">
                  <div className="py-1">
                    <p className="text-sm font-semibold">
                      {user.user_metadata.full_name}
                    </p>
                    <p className="text-sm">{user.user_metadata.email}</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-none border-b border-border px-[2px]">
                  <Link
                    className="block w-full rounded-sm p-2 hover:bg-foreground/10"
                    href="/"
                  >
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-none px-[2px]">
                  <Link
                    className="block w-full rounded-sm p-2 hover:bg-foreground/10"
                    href="/"
                  >
                    <span>Logout</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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
          </Link>
          <Link href="/auth/login">
            <Button className="w-full" variant="default">
              Login
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};
