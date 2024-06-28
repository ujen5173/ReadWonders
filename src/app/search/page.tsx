import { Filter } from "lucide-react";
import { Metadata } from "next";
import SearchArea from "~/components/sections/search-area";
import { Button } from "~/components/ui/button";
import { constructMetadata, siteConfig } from "~/config/site";
import { api } from "~/trpc/server";

interface Props {
  searchParams: { q: string };
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata | undefined> {
  return constructMetadata({
    title: `Search '${searchParams.q}' - ${siteConfig.name}`,
  });
}

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
        <div className="mb-8 flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center">
          <h1 className="space-x-1 text-xl font-bold md:text-2xl">
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
