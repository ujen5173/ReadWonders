import { ArrowDown } from "lucide-react";
import Card from "~/components/Card";
import { featuredStories, latestStories } from "~/data";

const FeaturedAndLatest = () => {
  return (
    <section className="w-full">
      <div className="container mx-auto flex flex-col gap-4 border-b border-border px-4 py-8 lg:flex-row">
        <Featured />
        <Latest />
      </div>
    </section>
  );
};

export default FeaturedAndLatest;

const Featured = () => {
  return (
    <section className="flex-1">
      <div className="mb-4 flex items-center gap-2">
        <h1 className="text-2xl font-semibold text-primary">Featured</h1>
        <ArrowDown size={18} className="text-primary" />
      </div>

      <main className="xxs:grid-cols-2 mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:md:grid-cols-3">
        {featuredStories.map((story) => (
          <Card key={story.id} details={story} />
        ))}
        <div className="mx-auto block w-full max-w-[270px] lg:hidden" />
      </main>
    </section>
  );
};

const Latest = () => {
  return (
    <section className="flex-1">
      <div className="mb-4 flex items-center gap-2">
        <h1 className="text-2xl font-semibold text-primary">Latest</h1>
        <ArrowDown size={18} className="text-primary" />
      </div>
      <main className="xxs:grid-cols-2 mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:md:grid-cols-3">
        {latestStories.map((story) => (
          <Card key={story.id} details={story} />
        ))}
        <div className="mx-auto block w-full max-w-[270px] lg:hidden" />
      </main>
    </section>
  );
};
