"use client";

import {
  Link01Icon,
  RedditIcon,
  Share01Icon,
  TwitterIcon,
} from "hugeicons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { toast } from "~/components/ui/use-toast";
import { env } from "~/env.js";

export function ShareButton() {
  const path = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
          <Share01Icon className="h-5 w-5" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-max min-w-48 bg-white">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="gap-2 py-2"
            onClick={async () => {
              await navigator.clipboard.writeText(window.location.href);
              toast({
                title: "Copied to clipboard",
              });
            }}
          >
            <Link01Icon className="size-5" />
            <span className="text-base font-medium text-foreground">
              Permalink
            </span>
          </DropdownMenuItem>
          <Link
            href={(() =>
              `https://twitter.com/intent/tweet?url=${env.NEXT_PUBLIC_APP_URL}${path}`)()}
            target="_blank"
          >
            <DropdownMenuItem className="flex items-center gap-2">
              <TwitterIcon className="size-5" />
              <span className="text-base font-medium text-foreground">
                Twitter
              </span>
            </DropdownMenuItem>
          </Link>
          <Link
            href={(() =>
              `https://reddit.com/submit?url=${env.NEXT_PUBLIC_APP_URL}${path}`)()}
            target="_blank"
          >
            <DropdownMenuItem className="flex items-center gap-2">
              <RedditIcon className="size-5" />
              <span className="text-base font-medium text-foreground">
                Reddit
              </span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
