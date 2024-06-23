"use client";

import CoverCard from "~/components/cover-card";
import { Skeleton } from "~/components/ui/skeleton";
import { cardHeight, cardWidth } from "~/server/constants";
import { api } from "~/trpc/react";

const SimilarStories = () => {
  const { data: similarStories, isLoading } = api.story.getAll.useQuery(
    {
      limit: 6,
      skip: 14,
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  return (
    <div className="w-full">
      <div className="mx-auto max-w-[1440px] border-y border-border py-8">
        <h1 className="mb-4 text-2xl font-semibold text-foreground">
          You'll also like
        </h1>
        <div className="flex gap-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                  style={{
                    width: cardWidth,
                    height: cardHeight / 1.2,
                  }}
                  key={i}
                />
              ))
            : similarStories?.map((recommendation) => (
                <CoverCard key={recommendation.id} details={recommendation} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default SimilarStories;
