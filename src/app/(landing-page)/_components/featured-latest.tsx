import BooksArea from "~/components/sections/books-area";

const FeaturedAndLatest = () => {
  return (
    <section className="w-full">
      <div className="container flex flex-col gap-4 border-b border-border px-4 py-8 lg:flex-row">
        {/* <Featured /> */}
        <BooksArea
          title="Featured"
          // data={featuredStories}
          carasoul={false}
          perRow={3}
        />
        {/* <Latest /> */}
        <BooksArea
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
