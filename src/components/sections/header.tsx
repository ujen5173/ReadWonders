"use client";

import { Menu, Plus } from "lucide-react";
import Link from "next/link";
import { suezOne } from "~/config/font";
import { cn } from "~/utils/cn";
import { Button, buttonVariants } from "../ui/button";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "sonner";
import useKeyPress from "~/hooks/use-key-press";
import { supabase } from "~/server/supabase/supabaseClient";
import { api } from "~/trpc/react";
import Logo from "../Logo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

const Header = () => {
  const { data } = api.auth.getProfile.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchQuery = inputRef.current?.value;

    if (!searchQuery?.trim()) return;

    router.push(`/search?q=${searchQuery}`);
  };

  const handleKeyPress = (): void => {
    inputRef.current?.focus();
  };

  useKeyPress(handleKeyPress);

  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="block md:hidden">
            <MobileMenu user={data} />
          </div>
          <Link
            className="mr-6 flex items-end gap-1"
            href={data ? "/dashboard" : "/"}
          >
            <Logo />
          </Link>
          <Link href="/" className="hidden md:inline">
            <Button className="gap-2" variant="link">
              <span>Explore</span>
            </Button>
          </Link>

          <Dialog>
            <DialogTrigger className="hidden sm:block" asChild>
              <Button variant="link">Newsletter</Button>
            </DialogTrigger>
            <DialogContent className="hidden sm:max-w-[425px] md:inline">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  Subscribe to Newsletter
                </DialogTitle>
                <DialogDescription className="text-sm">
                  Never miss an update. Stay up to date with the latest stories.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2 py-2">
                <Label htmlFor="username" className="text-left">
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="newsletter@readwonders.com"
                  className=""
                />
              </div>
              <DialogFooter>
                <Button type="submit">Subscribe</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Link href="/write">
            <Button className="hidden gap-2 sm:flex" variant="ghost-link">
              <Plus size={18} />
              <span>Write a story</span>
            </Button>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          <form
            className="relative hidden w-6/12 md:block"
            onSubmit={handleSubmit}
          >
            <Input ref={inputRef} placeholder="Search anything..." />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-white">
              <kbd className="pointer-events-none inline-flex select-none items-center gap-1 rounded border bg-muted px-1.5 py-1 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </form>

          {data ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="rounded">
                  <span className="sr-only">Open user menu</span>
                  <Image
                    src={data.profile!}
                    alt={data.name! + "Profile"}
                    width={120}
                    height={120}
                    className="size-8 rounded-full object-cover"
                  />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-[250px] bg-white" align="end">
                <DropdownMenuItem className="pointer-events-none cursor-default rounded-none border-b border-border">
                  <div className="py-[0.2rem]">
                    <p className="text-sm font-semibold">{data.name!}</p>
                    <p className="text-sm">{data.email!}</p>
                  </div>
                </DropdownMenuItem>

                <Link
                  className="block rounded-none border-b border-border px-[2px] py-[3px]"
                  href={`/user/${data.username!}`}
                >
                  <DropdownMenuItem className="block w-full rounded-sm p-2 transition hover:bg-foreground/10">
                    <span>My Profile</span>
                  </DropdownMenuItem>
                </Link>

                <Link
                  href="/reading-list"
                  className="block rounded-none border-b border-border px-[2px] py-[3px]"
                >
                  <DropdownMenuItem className="block w-full rounded-sm p-2 transition hover:bg-foreground/10">
                    <span>Reading List</span>
                  </DropdownMenuItem>
                </Link>

                <div
                  className="block rounded-none px-[2px] py-[3px]"
                  onClick={async () => {
                    try {
                      await supabase().auth.signOut();
                    } catch (err) {
                      toast("Error logging out");
                    }
                  }}
                >
                  <DropdownMenuItem className="block w-full rounded-sm p-2 transition hover:bg-destructive hover:text-destructive-foreground">
                    <span>Logout</span>
                  </DropdownMenuItem>
                </div>
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

const MobileMenu = ({
  user,
}: {
  user:
    | {
        id: string;
        name: string | null;
        username: string | null;
        profile: string | null;
        email: string | null;
      }
    | undefined;
}) => {
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
                Explore
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
        </ul>

        <div className="flex flex-col gap-2">
          <Link href="/">
            <Button className="w-full gap-2" variant="ghost-link">
              <Plus size={18} />
              <span>Write a story</span>
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};
