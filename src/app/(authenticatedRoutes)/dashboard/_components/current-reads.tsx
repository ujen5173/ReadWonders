import StoriesArea from "~/components/sections/stories-area";
import { fetchCurrentReads } from "~/storiesActions";
import ReadingSection from "./reading-section";

const CurrentReadsReadingList = () => {
  return (
    <section className="w-full">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 border-b border-border px-4 py-8 xl:flex-row">
        <StoriesArea
          title="Current Reads"
          fetcher={fetchCurrentReads}
          perRow={3}
          inRow={true}
        />
        <div className="flex-1">
          <ReadingSection />
        </div>
      </div>
    </section>
  );
};

export default CurrentReadsReadingList;
