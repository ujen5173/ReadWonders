"use client";

import ReadingListCard from "~/components/reading-list-card";
import { Skeleton } from "~/components/ui/skeleton";
import { cardHeight, defaultReadingList } from "~/server/constants";
import { api } from "~/trpc/react";
import { cn } from "~/utils/cn";

const ReadingListSection = ({
  perRow = 6,
  userId,
}: {
  perRow?: 2 | 6;
  userId: string;
}) => {
  const { data: readingLists, isLoading } = api.auth.readingLists.useQuery(
    {
      authorId: userId,
      limit: perRow,
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  return (
    <div
      className={cn(
        perRow === 2
          ? "grid grid-cols-1 gap-5 xs:grid-cols-2"
          : "grid grid-cols-1 gap-5 border-b border-border pb-8 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      )}
    >
      {isLoading ? (
        Array.from({ length: perRow }).map((_, index) => (
          <Skeleton
            style={{
              height: cardHeight / 1.4 + 32 + 44 + "px",
              width: "100%",
            }}
            className="rounded-2xl"
            key={index}
          />
        ))
      ) : (
        <>
          {readingLists &&
            (readingLists.length > 0 ? readingLists : defaultReadingList)?.map(
              (readingList) => (
                <ReadingListCard
                  key={readingList.id}
                  readingList={readingList}
                />
              ),
            )}
        </>
      )}
    </div>
  );
};

export default ReadingListSection;
