import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

const NotFound = ({
  title = "Oops! Page Played Hide and Seek",
  description = "Oops! This page is on vacation. While we lure it back with cookies, why not check out our other fun pages?",
}: {
  title?: string;
  description?: string;
}) => {
  return (
    <section className="w-full">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-center gap-8 px-4 py-32 md:flex-row">
        <h1 className="text-7xl font-black">404</h1>
        <Separator
          orientation="vertical"
          className="hidden h-24 w-1 md:block"
        />
        <div className="flex w-full min-w-96 flex-col items-center md:w-9/12 md:items-start lg:w-6/12">
          <h1 className="w-full text-center text-3xl font-extrabold text-slate-800 md:text-left">
            {title}
          </h1>
          <p className="mb-4 w-full text-center text-xl text-text-secondary md:text-left">
            {description}
          </p>
          <Link href="/">
            <Button>Back to homepage</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
