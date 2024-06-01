"use client";

import { useSearchParams } from "next/navigation";
import SearchBooks from "~/components/sections/search-books";

const Search = () => {
  const query = useSearchParams().get("q") || "";

  return (
    <SearchBooks
      title={`Search results for "${query}"`}
      defaultValue={query}
      infiniteScroll={false}
    />
  );
};

export default Search;
