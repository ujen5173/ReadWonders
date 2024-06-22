import { cardHeight, cardWidth } from "~/server/constants";
import { cn } from "~/utils/cn";
import { Skeleton } from "./ui/skeleton";

const LoadingRow = () => {
  return (
    <div className="mx-auto max-w-[1440px] border-b border-border px-4 py-8">
      <Skeleton className="mb-4 h-8 w-56" />
      <div
        className={cn(
          "relative grid w-full grid-cols-1 place-items-center gap-5 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
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
  );
};

const LoadingColumn = () => {
  return (
    <div>
      <Skeleton className="mb-4 h-8 w-56" />
      <div
        className={cn(
          "relative grid w-full grid-cols-1 place-items-center gap-5 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        )}
      >
        {Array.from({ length: 3 }).map((_, i) => (
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
  );
};

export { LoadingColumn, LoadingRow };
