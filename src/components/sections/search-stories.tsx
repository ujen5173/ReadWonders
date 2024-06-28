import { Filter } from "lucide-react";
import { Button } from "../ui/button";

const SearchStories = ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1440px] px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="space-x-1 text-2xl font-bold">
            <span>Search results for</span>
            {/* <span className="text-primary">&quot;{params.q}&quot;</span> */}
          </h1>
          <Button variant="secondary">
            <Filter size={18} className="text-foreground" />
            <span className="text-base">Filter</span>
          </Button>
        </div>
        <p className="text-center text-lg text-slate-600">
          {/* No results found for &quot;{params.q}&quot;. Try searching for */}
          {/* something else. */}
        </p>
      </div>
    </section>
  );
};

export default SearchStories;
