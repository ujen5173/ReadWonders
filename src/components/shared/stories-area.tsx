import { ArrowDown02Icon } from "hugeicons-react";
import { type FC } from "react";
import { cn } from "~/lib/utils";
import { cardHeight } from "~/server/constants";
import { type TCard } from "~/types";
import CoverCard from "./cover-card";
import SupriseButton from "./suprise-button";

type Props = {
  title: string;
  description?: string;
  perRow?: 3 | 6;
  inRow?: boolean;
  fetcher: () => Promise<
    (TCard & {
      readingList: boolean;
    })[]
  >;
  supriseStory?: boolean;
};

const StoriesArea: FC<Props> = async ({
  title,
  description,
  inRow = false,
  perRow = 3,
  fetcher,
  supriseStory = false,
}) => {
  const stories = await fetcher();

  return (
    <section className="flex-1">
      <div>
        <div className="flex items-center justify-between gap-4">
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-primary">{title}</h2>
            <ArrowDown02Icon size={20} className="text-primary" />
          </div>
        </div>

        {description && (
          <p className="text-text-secondary mb-4 text-lg font-medium">
            {description}
          </p>
        )}
      </div>
      {stories.length > 0 ? (
        <main
          className={cn(
            "xxxs:grid-cols-2 xs:grid-cols-3 relative grid w-full grid-cols-1 place-items-center gap-5 md:grid-cols-4 lg:grid-cols-5",
            inRow ? "xl:grid-cols-3" : "xl:grid-cols-6",
          )}
        >
          {stories?.map((story) => (
            <CoverCard key={story.id} details={story} />
          ))}
          {Array(Math.abs(perRow - stories.length))
            .fill(0)
            .map((_, i) => (
              <div className="mx-auto block flex-1" key={i} />
            ))}
          {perRow === 3 && Math.abs(perRow - stories.length) === 0 && (
            <>
              <div className="mx-auto hidden flex-1 md:block lg:hidden"></div>
              <div className="mx-auto hidden flex-1 md:block xl:hidden"></div>
            </>
          )}
        </main>
      ) : (
        <>
          {supriseStory ? (
            <div
              style={{
                height: cardHeight,
              }}
              className="flex flex-col items-center justify-center gap-2 py-8"
            >
              <p className="text-text-secondary text-center text-lg font-medium">
                You haven&apos;t added any stories yet.
              </p>
              <SupriseButton />
            </div>
          ) : (
            <div className="py-8">
              <p className="text-text-secondary text-center text-lg font-medium">
                No stories found.
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default StoriesArea;
