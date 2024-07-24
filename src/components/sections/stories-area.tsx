import { ArrowDown02Icon } from "hugeicons-react";
import { type FC } from "react";
import { TCard } from "~/types";
import { cn } from "~/utils/cn";
import CoverCard from "../cover-card";

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
};

const StoriesArea: FC<Props> = async ({
  title,
  description,
  inRow = false,
  perRow = 3,
  fetcher,
}) => {
  const stories = await fetcher();

  return (
    <section className="flex-1">
      <div>
        <div className="flex items-center justify-between gap-4">
          <div className="mb-4 flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-primary">{title}</h1>
            <ArrowDown02Icon size={20} className="text-primary" />
          </div>
        </div>

        {description && (
          <p className="mb-4 text-lg font-medium text-text-secondary">
            {description}
          </p>
        )}
      </div>
      <main
        className={cn(
          "relative grid w-full grid-cols-1 place-items-center gap-5 xxxs:grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
          inRow ? "xl:grid-cols-3" : "xl:grid-cols-6",
        )}
      >
        {stories.map((story) => (
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
    </section>
  );
};

export default StoriesArea;
