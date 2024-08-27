import { Suspense } from "react";
import { fetchFeaturedStories, fetchLatestStories } from "~/actions";
import { LoadingColumn } from "~/components/shared/Cardloading";
import StoriesArea from "~/components/shared/stories-area";

const FeaturedAndLatest = () => {
  return (
    <section className="w-full">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 border-b border-border px-4 py-8 xl:flex-row">
        {/* <Featured /> */}
        <Suspense fallback={<LoadingColumn />}>
          <StoriesArea
            fetcher={fetchFeaturedStories}
            title="Featured"
            perRow={3}
            inRow={true}
          />
        </Suspense>

        {/* <Latest /> */}
        <Suspense fallback={<LoadingColumn />}>
          <StoriesArea
            fetcher={fetchLatestStories}
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
