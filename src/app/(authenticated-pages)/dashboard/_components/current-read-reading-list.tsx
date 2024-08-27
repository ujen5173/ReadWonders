import { fetchCurrentReads } from "~/actions";
import ReadingSection from "~/app/_components/reading-list/reading-page-section";
import StoriesArea from "~/components/shared/stories-area";

const CurrentReadsReadingList = () => {
  return (
    <section className="w-full">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 border-b border-border px-4 py-8 xl:flex-row">
        <StoriesArea
          title="Current Reads"
          fetcher={fetchCurrentReads}
          perRow={3}
          inRow={true}
          supriseStory
        />
        <div className="flex-1">
          <ReadingSection />
        </div>
      </div>
    </section>
  );
};

export default CurrentReadsReadingList;
