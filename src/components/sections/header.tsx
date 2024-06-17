"use client";

import { Menu, Plus } from "lucide-react";
import Link from "next/link";
import { suezOne } from "~/config/font";
import { siteConfig } from "~/config/site";
import { cn } from "~/utils/cn";
import { Button, buttonVariants } from "../ui/button";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useUser } from "~/providers/AuthProvider/AuthProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

const Header = () => {
  const { user } = useUser();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchQuery = inputRef.current?.value;

    if (!searchQuery?.trim()) return;

    router.push(`/search?q=${searchQuery}`);
  };

  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="block md:hidden">
            <MobileMenu />
          </div>

          <Link className="mr-6" href={user ? "/dashboard" : "/"}>
            <h1
              className={cn(
                `${suezOne.className} text-2xl font-medium text-text-primary`,
              )}
            >
              <span className="text-primary">Read</span>
              <span>Wonders.</span>
            </h1>
          </Link>
          <Link href="/" className="hidden md:inline">
            <Button className="gap-2" variant="link">
              <span>Explore</span>
            </Button>
          </Link>
          <Link href="/" className="hidden md:inline">
            <Button className="gap-2" variant="link">
              <span>Newsletter</span>
            </Button>
          </Link>
          <Link href="/write">
            <Button className="hidden gap-2 sm:flex" variant="ghost-link">
              <Plus size={18} />
              <span>Write a story</span>
            </Button>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          <form className="hidden w-6/12 md:block" onSubmit={handleSubmit}>
            <Input ref={inputRef} placeholder="Search a story..." />
          </form>

          {user ? (
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
                  <div className="py-[0.2rem]">
                    <p className="text-sm font-semibold">
                      {user.user_metadata.full_name}
                    </p>
                    <p className="text-sm">{user.user_metadata.email}</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-none border-b border-border px-[2px] py-[3px]">
                  <Link
                    className="block w-full rounded-sm p-2 transition hover:bg-foreground/10"
                    href="/"
                  >
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-none border-b border-border px-[2px] py-[3px]">
                  <Link
                    className="block w-full rounded-sm p-2 transition hover:bg-foreground/10"
                    href="/"
                  >
                    <span>Reading List</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-none px-[2px] py-[3px]">
                  <Link
                    className="block w-full rounded-sm p-2 transition hover:bg-destructive hover:text-destructive-foreground"
                    href="/auth/logout"
                  >
                    <span>Logout</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/login">
              <Button>Login</Button>
            </Link>
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
                `${suezOne.className} text-left text-xl font-bold text-text-primary`,
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
                Stories
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
              <span>Write a story</span>
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
