"use client";

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
        <h1 className="mb-4 text-2xl font-semibold text-foreground"></h1>
      </div>
    </div>
  );
};

export default SimilarStories;
