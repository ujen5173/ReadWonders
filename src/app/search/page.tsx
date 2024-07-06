import { type Metadata } from "next";
import SearchArea from "~/components/sections/search-area";

import { constructMetadata, siteConfig } from "~/config/site";
import SearchHeader from "./_components/search-header";
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

const SearchStories = async () => {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1440px] border-b border-border px-4 py-12">
        <SearchHeader />
        <SearchArea />
      </div>
    </section>
  );
};

export default SearchStories;
