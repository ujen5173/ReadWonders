"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import CoverCard from "~/components/shared/cover-card";
import { Skeleton } from "~/components/ui/skeleton";
import useOnScreen from "~/hooks/use-on-screen";
import { cn } from "~/lib/utils";
import { cardHeight, cardWidth } from "~/server/constants";
import { api } from "~/trpc/react";

const validFilters = {
  len: ["1-10", "10-20", "20-30", "40+"],
  updated: ["anytime", "today", "week", "month"],
};

const SearchArea = () => {
  const query = useSearchParams();

  const { data, isFetching, hasNextPage, fetchNextPage } =
    api.story.search.useInfiniteQuery(
      {
        query: query.get("q") ?? "",
        limit: 7,
        filter: {
          len: query
            .getAll("len")
            .filter((e) => validFilters.len.includes(e ?? "1-10"))[0],
          updated: query
            .getAll("updated")
            .filter((e) => validFilters.updated.includes(e ?? "anytime"))[0],
          mature: !!(query.get("mature") === "true"),
          premium: !!(query.get("premium") === "true"),
        },
      },
      {
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        retry: 0,
      },
    );

  const stories = useMemo(
    () => [...(data?.pages.flatMap((page) => page?.stories ?? []) ?? [])],
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
      {stories.length > 0 && !isFetching ? (
        <main
          className={cn(
            "xxxs:grid-cols-2 xs:grid-cols-3 relative grid w-full grid-cols-1 place-items-center gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
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
      ) : (
        <>
          {isFetching ? (
            <div className="xxxs:grid-cols-2 xs:grid-cols-3 relative grid w-full grid-cols-1 place-items-center gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {Array(6)
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
                ))}
            </div>
          ) : (
            <div className="w-full text-center">
              <p className="text-2xl font-semibold">No stories found</p>
              <p className="text-lg text-gray-500">
                Try searching for something else
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchArea;
