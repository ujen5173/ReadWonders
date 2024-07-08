import { RecordIcon } from "hugeicons-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { getGenre } from "~/server/constants";
import { api } from "~/trpc/server";
import { formatNumber } from "~/utils/helpers";

const AllGenre = async () => {
  const genres = await api.genre.getGenre.query();

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[1440px] border-b border-border px-4 pb-6 pt-12">
        <h1 className="mb-6 text-2xl font-semibold xl:text-4xl">All Genres</h1>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {getGenre(genres).map((genre) => (
            <div
              key={genre.id}
              className="flex flex-col rounded-lg border border-border bg-white p-4 shadow-md"
            >
              <h2 className="mb-2 text-2xl font-semibold">{genre.name}</h2>
              <div className="flex-1">
                <p className="mb-4 text-base">{genre.description}</p>
              </div>
              {genre.stories && (
                <div className="mb-4 flex items-center gap-1 text-slate-600">
                  <span className="text-base font-medium">
                    {formatNumber(genre.stories!)} stories
                  </span>
                  <RecordIcon className="size-[6px] fill-slate-600" />
                  <span className="text-base font-medium">
                    {formatNumber(genre.stories! / 51)} authors
                  </span>
                </div>
              )}
              <div className="flex gap-2">
                <Link className="w-full" href={`/genre${genre.slug}`}>
                  <Button
                    className="w-full"
                    variant={genre.stories === null ? "default" : "secondary"}
                  >
                    Explore
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllGenre;
