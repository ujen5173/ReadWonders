"use client";

import ReadingListCard from "~/components/reading-list-card";
import { Skeleton } from "~/components/ui/skeleton";
import { cardHeight, cardWidth } from "~/server/constants";
import { api } from "~/trpc/react";

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
        : readingLists?.map((readingList) => (
            <ReadingListCard key={readingList.id} readingList={readingList} />
          ))}
    </div>
  );
};

export default ReadingListSection;
