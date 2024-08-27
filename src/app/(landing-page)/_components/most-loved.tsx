import { Suspense } from "react";
import { fetchMostLoved } from "~/actions";
import { LoadingRow } from "~/components/shared/Cardloading";
import StoriesArea from "~/components/shared/stories-area";

const MostLoved = () => {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1440px] border-b border-border px-4 py-8">
        <Suspense fallback={<LoadingRow />}>
          <StoriesArea
            title="Most Loved Stories"
            perRow={6}
            fetcher={fetchMostLoved}
          />
        </Suspense>
      </div>
    </section>
  );
};

export default MostLoved;
