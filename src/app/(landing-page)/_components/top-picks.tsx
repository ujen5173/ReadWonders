import { Suspense } from "react";
import { fetchTopPicks } from "~/actions";
import { LoadingRow } from "~/components/shared/Cardloading";
import StoriesArea from "~/components/shared/stories-area";

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
