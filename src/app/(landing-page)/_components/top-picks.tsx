import { Suspense } from "react";
import { LoadingRow } from "~/components/Cardloading";
import StoriesArea from "~/components/sections/stories-area";

const TopPicks = () => {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1440px] border-b border-border px-4 py-8">
        <Suspense fallback={<LoadingRow />}>
          <StoriesArea
            title="Top Picks on different genres"
            perRow={6}
            skipRow={14}
          />
        </Suspense>
      </div>
    </section>
  );
};

export default TopPicks;
