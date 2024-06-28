"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import useOnScreen from "~/hooks/use-on-screen";
import { cardHeight, cardWidth } from "~/server/constants";
import { api } from "~/trpc/react";
import { TCard } from "~/types";
import { cn } from "~/utils/cn";
import CoverCard from "../cover-card";
import { Skeleton } from "../ui/skeleton";

const SearchArea = ({
  defaultResults,
}: {
  defaultResults: {
    nextCursor: string | undefined;
    stories: TCard[];
    hasNextPage: boolean;
  };
}) => {
  const query = useSearchParams();
  const { data, isFetching, hasNextPage, fetchNextPage } =
    api.story.search.useInfiniteQuery(
      {
        query: query.get("q") || "",
        limit: 7,
      },
      {
        initialCursor:
          defaultResults.stories[defaultResults.stories.length - 1]?.id,
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        enabled: (() => {
          return query.get("q") !== null;
        })(),
        retry: 0,
      },
    );

  const stories = useMemo(
    () => [
      ...defaultResults.stories,
      ...(data?.pages.flatMap((page) => page?.stories ?? []) ?? []),
    ],
    [data],
  );

  const bottomRef = useRef<HTMLDivElement>(null);

  const reachedBottom = useOnScreen(bottomRef);

  useEffect(() => {
    if (reachedBottom && (hasNextPage === undefined || hasNextPage)) {
      void fetchNextPage();
    }
  }, [reachedBottom]);

  return (
    <div className="space-y-2">
      <main
        className={cn(
          "relative grid w-full grid-cols-1 place-items-center gap-5 xxxs:grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
        )}
      >
        {stories.map((story) => (
          <CoverCard key={story.id} details={story} />
        ))}

        {(hasNextPage === undefined || hasNextPage) && isFetching
          ? Array(6)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="relative h-full w-full space-y-2">
                  <Skeleton
                    style={{
                      width: "100%",
                      minHeight: cardHeight + "px",
                      height: "calc(100% - 22px - 0.8rem)",
                    }}
                  />
                  <Skeleton style={{ width: "80%", height: "20px" }} />
                </div>
              ))
          : null}

        <div
          ref={bottomRef}
          className="absolute"
          style={{
            bottom: cardWidth * 1.5 + "px",
          }}
        />
      </main>
    </div>
  );
};

export default SearchArea;
