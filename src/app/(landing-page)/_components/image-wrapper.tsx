"use client";

import Image from "next/image";
import Link from "next/link";
import { type Dispatch, type SetStateAction } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import { cardHeight, cardWidth } from "~/server/constants";

const ImagesWrapper = ({
  chunk,
  index,
  hoveredImage,
  setHoveredImage,
}: {
  chunk: { thumbnail: string; slug: string | null; title: string | null }[];
  hoveredImage: string | null;
  setHoveredImage: Dispatch<SetStateAction<string | null>>;
  index: number;
}) => {
  return (
    <div className="flex h-full flex-1 flex-col gap-2">
      {chunk.map((image, i) =>
        image.thumbnail ? (
          <TooltipProvider key={i} delayDuration={10}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  style={{
                    width: cardWidth / 1.5,
                    height: cardHeight / 1.5,
                    marginTop: i === 0 ? -((index + 1) * 2.5) + "rem" : 0,
                  }}
                  target="_blank"
                  href={image.slug ? `/story/${image.slug}` : "#"}
                >
                  <Image
                    onMouseEnter={() => setHoveredImage(image.slug)}
                    onMouseLeave={() => setHoveredImage(null)}
                    key={i}
                    src={image.thumbnail}
                    alt={image.title ?? "Image"}
                    className={cn(
                      hoveredImage === image.slug
                        ? ""
                        : `${hoveredImage !== null ? "opacity-60 blur-[1px]" : ""}`,

                      "border/40 h-full w-full rounded-lg border object-cover transition-all duration-500 ease-in-out",
                    )}
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
        ) : (
          <div
            key={i}
            className="border/40 rounded-lg bg-slate-100"
            style={{ width: cardWidth, height: cardHeight }}
          ></div>
        ),
      )}
    </div>
  );
};

export default ImagesWrapper;
