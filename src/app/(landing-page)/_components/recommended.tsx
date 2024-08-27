import { Suspense } from "react";
import { fetchRecommendations } from "~/actions";
import { LoadingRow } from "~/components/shared/Cardloading";
import StoriesArea from "~/components/shared/stories-area";

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
