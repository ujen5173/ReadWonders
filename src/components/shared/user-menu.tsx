"use client";

import {
  LibraryIcon,
  Logout02Icon,
  Notebook01Icon,
  Settings01Icon,
} from "hugeicons-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { toast } from "~/components/ui/use-toast";
import { merriweather } from "~/config/font";
import { cn } from "~/lib/utils";

const UserMenu = ({
  type = "normal",
  user,
}: {
  type?: "normal" | "mobile";
  user: {
    id: string;
    name: string | null;
    email: string | null;
    username: string;
    profile: string | null;
  };
}) => {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={type === "normal" ? "rounded" : "default"}
          className={cn(type === "mobile" && "h-auto justify-start")}
        >
          <span className="sr-only">Open user menu</span>
          <Image
            src={user.profile!}
            alt={user.name + "Profile"}
            width={120}
            height={120}
            className="size-8 rounded-full object-cover"
          />
          {type === "mobile" && (
            <div className="rounded-sm py-[2px] text-left">
              <p className="text-base font-bold">{user.name}</p>
              <p className="text-sm">{user.email}</p>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className={cn("w-[250px] bg-white", merriweather.className)}
        align="end"
      >
        {type === "normal" && (
          <DropdownMenuItem className="rounded-none border-b border-border p-0">
            <Link
              href={`/user/${user.id}?identity=id`}
              className="mb-1 block w-full"
            >
              <div className="rounded-sm p-2 hover:bg-foreground/10">
                <p className="text-base font-bold">{user.name}</p>
                <p className="text-sm">{user.email}</p>
              </div>
            </Link>
          </DropdownMenuItem>
        )}

        <Link
          href="/reading-list"
          className="block rounded-none border-b border-border py-1"
        >
          <DropdownMenuItem className="p-0 hover:bg-transparent">
            <div className="inline-flex w-full items-center gap-2 rounded-sm p-2 transition hover:bg-blue-500/30">
              <Notebook01Icon className="size-4" />
              <span>Reading List</span>
            </div>
          </DropdownMenuItem>
        </Link>

        <Link
          className="block rounded-none border-b border-border py-1"
          href="/works"
        >
          <DropdownMenuItem className="p-0 hover:bg-transparent">
            <div className="inline-flex w-full items-center gap-2 rounded-sm p-2 transition hover:bg-orange-500/30">
              <LibraryIcon className="size-4" />
              <span>Works</span>
            </div>
          </DropdownMenuItem>
        </Link>

        <Link
          className="block rounded-none border-b border-border py-1"
          href="/settings/profile"
        >
          <DropdownMenuItem className="p-0 hover:bg-transparent">
            <div className="inline-flex w-full items-center gap-2 rounded-sm p-2 transition hover:bg-green-500/30">
              <Settings01Icon className="size-4" />
              <span>Settings</span>
            </div>
          </DropdownMenuItem>
        </Link>

        <div
          className="block rounded-none py-1"
          onClick={async () => {
            try {
              await signOut();
              router.push("/");
            } catch (err) {
              toast({
                title: "Error logging out",
              });
            }
          }}
        >
          <DropdownMenuItem className="p-0 hover:bg-transparent">
            <div className="inline-flex w-full items-center gap-2 rounded-sm p-2 transition hover:bg-destructive hover:text-destructive-foreground">
              <Logout02Icon className="size-4" />
              <span>Logout</span>
            </div>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
