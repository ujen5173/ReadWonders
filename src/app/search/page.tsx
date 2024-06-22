import { Filter } from "lucide-react";
import SearchArea from "~/components/sections/search-area";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";

const SearchStories = async ({
  searchParams,
}: {
  searchParams: { q: string };
}) => {
  const data = await api.story.search.query({
    query: searchParams.q,
    limit: 20,
  });

  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1440px] border-b border-border px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="space-x-1 text-2xl font-bold">
            <span>Search results for</span>
            <span className="text-primary">&quot;{searchParams.q}&quot;</span>
          </h1>
          <Button variant="secondary">
            <Filter size={18} className="text-foreground" />
            <span className="text-base">Filter</span>
          </Button>
        </div>
        <SearchArea defaultResults={data} />
      </div>
    </section>
  );
};

export default SearchStories;
