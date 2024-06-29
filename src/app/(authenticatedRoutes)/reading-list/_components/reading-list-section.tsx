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
        "grid grid-cols-1 gap-5 xs:grid-cols-2 lg:grid-cols-3",
        perRow === 2
          ? "xl:grid-cols-2"
          : "border-b border-border pb-8 xl:grid-cols-4",
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
      {Array(Math.abs(perRow - (readingLists ?? []).length))
        .fill(0)
        .map((_, i) => (
          <div className="mx-auto block flex-1" key={i} />
        ))}

      {perRow === 2 && Math.abs(perRow - (readingLists ?? []).length) === 0 && (
        <>
          <div className="mx-auto hidden flex-1 md:block lg:hidden"></div>
          <div className="mx-auto hidden flex-1 md:block xl:hidden"></div>
        </>
      )}
    </div>
  );
};

export default ReadingListSection;
