"use client";

import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { cardHeight, cardWidth } from "~/server/constants";
import { api } from "~/trpc/react";

// reading list mini book size
const bookWidth = cardWidth / 1.5;
const bookHeight = cardHeight / 1.4;

const ReadingListSection = ({ userId }: { userId: string }) => {
  const { data: readingLists, isLoading } = api.auth.readingLists.useQuery({
    authorId: userId,
  });

  return (
    <div className="flex flex-wrap gap-6 border-b border-border pb-8">
      {isLoading
        ? Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              style={{
                height: cardHeight / 1.4 + 32 + 44 + 70 + "px",
                width: cardWidth * 2 + "px",
              }}
              className="rounded-2xl"
              key={index}
            />
          ))
        : readingLists?.map((readingList) => {
            return (
              <div
                key={readingList.id}
                className="overflow-hidden rounded-2xl border border-border bg-white shadow-md"
              >
                <div className="flex items-center justify-between gap-4 p-4">
                  <h2 className="line-clamp-1 text-xl font-medium">
                    {readingList.title}
                  </h2>
                  <Button size={"icon"} variant={"secondary"}>
                    <EllipsisVertical size={24} />
                  </Button>
                </div>
                <div
                  style={{
                    height: cardHeight / 1.4 + 32 + 44 + "px",
                    width: cardWidth * 2 + "px",
                  }}
                  className="relative flex w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-b-2xl border-t-2 border-slate-200 bg-slate-100 p-4"
                >
                  {readingList.stories.map((story, index) => {
                    // Centering calculation for the cards
                    const length = readingList.stories.length;
                    const shiftX = 20 * length; // control horizontal shift
                    const shiftY = 12; // control vertical shift
                    const initialX = (-(length - 1) * shiftX) / 2; // Centering calculation for X
                    const initialY = (-(length - 1) * shiftY) / 2; // Centering calculation for Y
                    const transform = `translate(${initialX + index * shiftX}px, ${initialY + index * shiftY}px)`;

                    return (
                      <div
                        key={index}
                        className="absolute"
                        style={{
                          width: bookWidth + "px",
                          height: bookHeight + "px",
                          zIndex: length - index,
                          transform,
                        }}
                      >
                        <Image
                          src={story.thumbnail}
                          className="relative inset-0 h-full w-full rounded-md border border-border object-fill shadow"
                          style={{
                            zIndex: readingList.stories.length - index,
                          }}
                          alt={"thumbnail"}
                          width={bookWidth}
                          height={bookHeight}
                        />
                        <div
                          className="absolute -bottom-[5px] -right-[5px] rounded border border-border bg-stone-100 shadow-lg"
                          style={{
                            zIndex: -index,
                            width: bookWidth + "px",
                            height: bookHeight + "px",
                          }}
                        ></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
    </div>
  );
};

export default ReadingListSection;
