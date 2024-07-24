"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cardHeight, cardWidth } from "~/server/constants";

const ImagesWrapper = ({
  chunk,
  index,
}: {
  chunk: { thumbnail: string; slug: string | null; title: string | null }[];
  index: number;
}) => {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  return (
    <div className="flex flex-1 flex-col gap-2">
      {chunk.map((image, i) =>
        image.thumbnail ? (
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
                      marginTop: i === 0 ? -((index + 1) * 2.5) + "rem" : 0,
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
