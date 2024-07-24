import { Suspense } from "react";
import { LoadingRow } from "~/components/Cardloading";
import StoriesArea from "~/components/sections/stories-area";
import { fetchMostLoved } from "~/storiesActions";

const MostLoved = () => {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1440px] border-b border-border px-4 py-8">
        <Suspense fallback={<LoadingRow />}>
          <StoriesArea title="Most Loved" perRow={6} fetcher={fetchMostLoved} />
        </Suspense>
      </div>
    </section>
  );
};

export default MostLoved;
