"use client";

import {
  Link01Icon,
  RedditIcon,
  Share01Icon,
  TwitterIcon,
} from "hugeicons-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function ShareButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Share01Icon className="h-5 w-5" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-max min-w-48 bg-white">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="gap-2 py-2"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
          >
            <Link01Icon className="size-5" />
            <span className="text-base font-medium text-foreground">
              Permalink
            </span>
          </DropdownMenuItem>
          <a
            href={`https://twitter.com/intent/tweet?url=${window.location.href}`}
            target="_blank"
          >
            <DropdownMenuItem className="flex items-center gap-2">
              <TwitterIcon className="size-5" />
              <span className="text-base font-medium text-foreground">
                Twitter
              </span>
            </DropdownMenuItem>
          </a>
          <a
            href={`https://reddit.com/submit?url=${window.location.href}`}
            target="_blank"
          >
            <DropdownMenuItem className="flex items-center gap-2">
              <RedditIcon className="size-5" />
              <span className="text-base font-medium text-foreground">
                Reddit
              </span>
            </DropdownMenuItem>
          </a>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
