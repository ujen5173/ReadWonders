import { Suspense } from "react";
import { LoadingColumn } from "~/components/Cardloading";
import StoriesArea from "~/components/sections/stories-area";
import { api } from "~/trpc/server";

const FeaturedAndLatest = async () => {
  const featured = await api.story.featuredStories.query({
    limit: 3,
  });

  const latest = await api.story.latestStories.query({
    limit: 3,
  });

  return (
    <section className="w-full">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 border-b border-border px-4 py-8 xl:flex-row">
        {/* <Featured /> */}
        <Suspense fallback={<LoadingColumn />}>
          <StoriesArea
            stories={featured}
            title="Featured"
            perRow={3}
            inRow={true}
          />
        </Suspense>

        {/* <Latest /> */}
        <Suspense fallback={<LoadingColumn />}>
          <StoriesArea
            stories={latest}
            title="Latest"
            perRow={3}
            inRow={true}
          />
        </Suspense>
      </div>
    </section>
  );
};

export default FeaturedAndLatest;
