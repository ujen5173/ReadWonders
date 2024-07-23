"use client";

import { BookBookmark02Icon, StarIcon } from "hugeicons-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { merriweather } from "~/config/font";
import { siteConfig } from "~/config/site";
import { heroImagesFallback } from "~/data";
import { cardHeight, cardWidth } from "~/server/constants";
import { cn } from "~/utils/cn";
import { chunkIntoN } from "~/utils/helpers";

const HeroSection = ({
  data,
}: {
  data: {
    slug: string;
    thumbnail: string;
    title: string;
  }[];
}) => {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  return (
    <section className="w-full">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center gap-6 border-b border-border px-4 py-6 md:flex-row">
        <div className="py-12">
          <h1
            className={cn(
              `${merriweather.className} text-text-light mb-5 text-4xl font-extrabold md:text-5xl`,
            )}
          >
            Find Timeless <span className="relative text-primary">Stories</span>{" "}
            <br /> That Transport and Inspire
          </h1>

          <p className="mb-5 text-base text-slate-800 md:text-lg">
            {siteConfig.description}
          </p>

          <Link href="/genre">
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

        <div className="hidden max-h-[30rem] w-9/12 gap-2 overflow-hidden lg:flex">
          {chunkIntoN(data ?? heroImagesFallback, 4).map((chunk, index) => {
            return (
              <div key={index} className="flex flex-1 flex-col gap-2">
                {chunk.map((image, i) => (
                  <TooltipProvider key={i} delayDuration={10}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          target="_blank"
                          href={image.slug ? `/story/${image.slug}` : "#"}
                        >
                          <Image
                            onMouseEnter={() => setHoveredImage(image.slug)}
                            onMouseLeave={() => setHoveredImage(null)}
                            key={i}
                            src={image.thumbnail}
                            alt="A person reading a story"
                            className={`${hoveredImage === image.slug ? "" : `${hoveredImage !== null ? "opacity-60 blur-[1px]" : ""}`} 
                                    border/40 rounded-lg border object-cover transition-all duration-500 ease-in-out`}
                            style={{
                              marginTop:
                                i === 0 ? -((index + 1) * 2.5) + "rem" : 0,
                            }}
                            width={cardWidth}
                            height={cardHeight}
                          />
                        </Link>
                      </TooltipTrigger>
                      {image.title && (
                        <TooltipContent className="border-transparent bg-primary text-slate-100">
                          <p>{image.title}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
