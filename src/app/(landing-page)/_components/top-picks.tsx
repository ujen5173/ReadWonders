import { Suspense } from "react";
import { LoadingRow } from "~/components/Cardloading";
import StoriesArea from "~/components/sections/stories-area";
import { fetchTopPicks } from "~/storiesActions";

const TopPicks = async () => {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1440px] border-b border-border px-4 py-8">
        <Suspense fallback={<LoadingRow />}>
          <StoriesArea
            title="Top Picks on different genres"
            perRow={6}
            fetcher={fetchTopPicks}
          />
        </Suspense>
      </div>
    </section>
  );
};

export default TopPicks;
