import { BookBookmark02Icon, StarIcon } from "hugeicons-react";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "~/components/ui/button";
import { merriweather } from "~/config/font";
import { siteConfig } from "~/config/site";
import { cn } from "~/lib/utils";
import ImagesRender from "./images-render";

const HeroSection = async () => {
  return (
    <section className="w-full">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-6 border-b border-border px-4 py-6 md:flex-row">
        <div className="py-12">
          <h1
            className={cn(
              `${merriweather.className} text-text-light mb-5 text-4xl font-extrabold md:text-5xl`,
              "md:leading-none",
            )}
          >
            Find Timeless <span className="relative text-primary">Stories</span>{" "}
            <br /> That Transport and
            <br /> Inspire
          </h1>

          <p className="mb-5 text-base text-slate-800 md:text-lg">
            {siteConfig.description}
          </p>

          <Link href="/auth/login">
            <Button className="mb-5 gap-2">
              <BookBookmark02Icon
                className="rotate-12"
                size={18}
                color="#fff"
              />
              <span>Get Started on Your Story Quest</span>
            </Button>
          </Link>

          <div className="flex flex-col items-start">
            <div className="mb-1 flex">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <StarIcon
                    key={i}
                    size={20}
                    className="fill-amber-400 text-transparent"
                    stroke="currentColor"
                  />
                ))}
            </div>
            <p className="text-center text-sm text-slate-800 md:text-left">
              Already
              <span className="mx-1 rounded-full text-lg font-bold text-primary underline underline-offset-4">
                1 Million+
              </span>
              <span className="font-bold">#storytellers</span> are sharing their
              stories.
            </p>
          </div>
        </div>

        <Suspense fallback={<ImagesRender />}>
          <ImagesRender />
        </Suspense>
      </div>
    </section>
  );
};

export default HeroSection;
