"use client";

import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/utils/cn";

const StartReading = ({ hasChapter }: { hasChapter: string | null }) => {
  return (
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
  );
};

export default StartReading;
