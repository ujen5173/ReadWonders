"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

const NotFound = ({
  title = "Oops! Page Played Hide and Seek",
  description = "Oops! This page is on vacation. While we lure it back with cookies, why not check out our other fun pages?",
  code = "404",
}: {
  title?: string;
  description?: string;
  code?: string;
}) => {
  return (
    <section className="w-full">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-center gap-8 px-4 py-32 md:flex-row">
        <h1 className="text-7xl font-black">{code}</h1>
        <Separator
          orientation="vertical"
          className="hidden h-32 w-1 md:block"
        />
        <div className="flex w-full min-w-96 flex-col items-center md:w-9/12 md:items-start lg:w-6/12">
          <h1 className="mb-2 w-full text-center text-3xl font-extrabold text-slate-800 md:text-left">
            {/* {title} */}
            Readwonders under maintainance
          </h1>
          <p className="text-text-secondary mb-4 w-full text-center text-xl md:text-left">
            {/* {description} */}
            We&apos;re currently in the process of rebuilding and enhancing the
            site to serve you better. Please check back soon for a refreshed
            experience!
          </p>
          <div className="flex gap-2">
            <Link href="/">
              <Button>Back to homepage</Button>
            </Link>
            <Button
              onClick={() => {
                window.location.reload();
              }}
              variant={"secondary"}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
