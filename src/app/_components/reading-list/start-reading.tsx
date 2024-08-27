"use client";

import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

const StartReading = ({ hasChapter }: { hasChapter: string | null }) => {
  return (
    <TooltipProvider delayDuration={20}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button disabled={!hasChapter}>
            <Link
              href={hasChapter ?? "#"}
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-full",
                (() => {
                  if (hasChapter) {
                    return "";
                  }

                  return "pointer-events-none cursor-not-allowed opacity-70";
                })(),
              )}
            >
              Start Reading
            </Link>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {hasChapter
              ? "Start reading the story."
              : "Story not started yet. Follow to get notified"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default StartReading;
