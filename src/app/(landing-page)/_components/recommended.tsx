import { Suspense } from "react";
import { LoadingRow } from "~/components/Cardloading";
import StoriesArea from "~/components/sections/stories-area";
import { fetchRecommendations } from "~/storiesActions";

const Recommended = async () => {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1440px] border-b border-border px-4 py-8">
        <Suspense fallback={<LoadingRow />}>
          <StoriesArea
            title="Recommended Stories"
            perRow={6}
            fetcher={fetchRecommendations}
          />
        </Suspense>
      </div>
    </section>
  );
};

export default Recommended;
