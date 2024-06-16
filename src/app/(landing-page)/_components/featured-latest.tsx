import StoriesArea from "~/components/sections/stories-area";

const FeaturedAndLatest = () => {
  return (
    <section className="w-full">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 border-b border-border px-4 py-8 lg:flex-row">
        {/* <Featured /> */}
        <StoriesArea
          title="Featured"
          // data={featuredStories}
          carasoul={false}
          perRow={3}
        />
        {/* <Latest /> */}
        <StoriesArea
          title="Latest"
          // data={latestStories}
          carasoul={false}
          perRow={3}
        />
      </div>
    </section>
  );
};

export default FeaturedAndLatest;
