"use client";

import { LoadingRow } from "~/components/Cardloading";
import StoriesArea from "~/components/sections/stories-area";
import { api } from "~/trpc/react";

const MostLoved = () => {
  const { data, isLoading } = api.story.mostLoved.useQuery({ limit: 6 });
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1440px] border-b border-border px-4 py-8">
        {isLoading ? (
          <LoadingRow />
        ) : (
          (data ?? []) && (
            <StoriesArea title="Most Loved" perRow={6} stories={data ?? []} />
          )
        )}
      </div>
    </section>
  );
};

export default MostLoved;
