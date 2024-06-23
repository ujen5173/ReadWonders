"use client";

import CoverCard from "~/components/cover-card";
import { Skeleton } from "~/components/ui/skeleton";
import { cardHeight, cardWidth } from "~/server/constants";
import { api } from "~/trpc/react";
import { cn } from "~/utils/cn";

const Genre = ({ params }: { params: { slug: string } }) => {
  const { data, isLoading } = api.story.fromGenre.useQuery({
    slug: params.slug,
  });

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[1440px] border-b border-border px-4 pb-6 pt-12">
        <h1 className="mb-6 text-2xl font-semibold xl:text-4xl">
          <span className="text-primary">
            &apos;&apos;
            {params.slug.charAt(0).toUpperCase() + params.slug.slice(1)}
            &apos;&apos;
          </span>{" "}
          Stories
        </h1>

        {isLoading ? (
          <div className="mx-auto max-w-[1440px]">
            <div
              className={cn(
                "relative grid w-full grid-cols-1 place-items-center gap-5 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
              )}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                  key={i}
                  style={{
                    width: cardWidth + "px",
                    height: cardHeight * 1.16 + "px",
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            {(data ?? []).length === 0 ? (
              <div className="w-full py-12 text-center">
                <h2 className="text-xl font-medium">
                  No stories found in this genre.
                </h2>
              </div>
            ) : (
              <main
                className={cn(
                  "relative grid w-full grid-cols-1 place-items-center gap-5 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
                )}
              >
                {data?.map((story) => (
                  <CoverCard key={story.id} details={story} />
                ))}
              </main>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Genre;
