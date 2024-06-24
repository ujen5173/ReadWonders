"use client";

import ReadingListCard from "~/components/reading-list-card";
import { Skeleton } from "~/components/ui/skeleton";
import { cardHeight } from "~/server/constants";
import { api } from "~/trpc/react";

const ReadingListSection = ({ userId }: { userId: string }) => {
  const { data: readingLists, isLoading } = api.auth.readingLists.useQuery(
    {
      authorId: userId,
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  return (
    <div className="grid grid-cols-1 gap-5 border-b border-border pb-8 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {isLoading ? (
        Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            style={{
              height: cardHeight / 1.4 + 32 + 44 + 70 + "px",
              width: "100%",
            }}
            className="rounded-2xl"
            key={index}
          />
        ))
      ) : (readingLists ?? []).length > 0 ? (
        readingLists?.map((readingList) => (
          <ReadingListCard key={readingList.id} readingList={readingList} />
        ))
      ) : (
        <div className="w-full text-center text-lg text-gray-500">
          No stories found!
        </div>
      )}
    </div>
  );
};

export default ReadingListSection;
