import { ArrowDown } from "lucide-react";
import { type FC } from "react";
import { api } from "~/trpc/server";
import { cn } from "~/utils/cn";
import CoverCard from "../cover-card";

type Props = {
  title: string;
  description?: string;
  perRow?: 3 | 6;
  inRow?: boolean;
  skipRow?: number;
};

const StoriesArea: FC<Props> = async ({
  title,
  description,
  inRow = false,
  perRow = 3,
  skipRow = 12,
}) => {
  const data = await api.story.featuredStories.query({
    limit: perRow,
    skip: skipRow,
  });

  return (
    <section className="flex-1">
      <div>
        <div className="flex items-center justify-between gap-4">
          <div className="mb-4 flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-primary">{title}</h1>
            <ArrowDown size={18} className="text-primary" />
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
          inRow
            ? "relative grid w-full grid-cols-1 place-items-center gap-5 xs:grid-cols-2 sm:grid-cols-3"
            : "relative grid w-full grid-cols-1 place-items-center gap-5 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
        )}
      >
        {(data ?? []).map((story) => (
          <CoverCard key={story.id} details={story} />
        ))}

        {Array(Math.abs(perRow - (data ?? []).length))
          .fill(0)
          .map((_, i) => (
            <div className="mx-auto block flex-1" key={i} />
          ))}
      </main>
    </section>
  );
};

export default StoriesArea;
