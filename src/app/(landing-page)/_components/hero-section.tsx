"use client";

import { BookMarked, Star } from "lucide-react";
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
import { api } from "~/trpc/react";
import { cn } from "~/utils/cn";
import { chunkIntoN } from "~/utils/helpers";

const HeroSection = () => {
  const { data, isLoading } = api.helpers.images.useQuery();
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const { mutate, isLoading: updating } = api.example.update.useMutation();

  return (
    <section className="w-full">
      {/* <Button
        onClick={() => {
          mutate();
        }}
        loading={updating}
      >
        Update
      </Button> */}
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

          <p className="mb-5 text-sm text-slate-800 md:text-base">
            {siteConfig.description}
          </p>

          <Button className="mb-5 gap-2">
            <BookMarked className="rotate-12" size={18} color="#fff" />
            <span>Browse the best Reading collection</span>
          </Button>

          <div className="flex flex-col items-start">
            <div className="mb-1 flex">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    size={22}
                    className="fill-amber-400 stroke-amber-400"
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
          {isLoading
            ? Array(4)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="flex flex-1 flex-col gap-2"
                    style={{
                      height: `calc(14rem* 4 + 0.5rem* 2)`,
                    }}
                  >
                    {Array(6)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          key={i}
                          style={{
                            marginTop:
                              i === 0 ? -((index + 1) * 2.5) + "rem" : 0,
                          }}
                          className="border/40 h-56 w-full animate-pulse rounded-lg border bg-slate-200"
                        />
                      ))}
                  </div>
                ))
            : chunkIntoN(data ?? heroImagesFallback, 4).map((chunk, index) => {
                return (
                  <div key={index} className="flex flex-1 flex-col gap-2">
                    {chunk.map((image, i) => (
                      <TooltipProvider key={i} delayDuration={10}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href={image.slug ? `/story/${image.slug}` : "#"}
                            >
                              <Image
                                onMouseEnter={() => setHoveredImage(image.slug)}
                                onMouseLeave={() => setHoveredImage(null)}
                                key={i}
                                src={image.thumbnail}
                                alt="A person reading a story"
                                className={`${hoveredImage === image.slug ? "" : `${hoveredImage !== null ? "opacity-50" : ""}`} 
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
