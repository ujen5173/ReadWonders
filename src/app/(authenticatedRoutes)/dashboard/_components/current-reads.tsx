"use client";

import StoriesArea from "~/components/sections/stories-area";
import { api } from "~/trpc/react";

const CurrentReads = () => {
  const fetchCurrentReads = () => api.auth.currentReads.useQuery({ limit: 3 });
  return (
    <section className="w-full">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 border-b border-border px-4 py-8 xl:flex-row">
        <StoriesArea
          title="Current Reads"
          fetcher={fetchCurrentReads}
          perRow={3}
          inRow={true}
        />
      </div>
    </section>
  );
};

export default CurrentReads;
