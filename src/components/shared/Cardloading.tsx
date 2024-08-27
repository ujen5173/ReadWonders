import { cn } from "~/lib/utils";
import { Skeleton } from "../ui/skeleton";

const LoadingRow = () => {
  return (
    <div className="mx-auto max-w-[1440px]">
      <Skeleton className="mb-4 h-8 w-56" />
      <div
        className={cn(
          "xxxs:grid-cols-2 xs:grid-cols-3 relative grid w-full grid-cols-1 place-items-center gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
        )}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className="loading-skeleton"
            style={{
              width: "100%",
            }}
          />
        ))}
      </div>
    </div>
  );
};

const LoadingColumn = () => {
  return (
    <div className="flex-1">
      <Skeleton className="mb-4 h-8 w-56" />
      <div
        className={cn(
          "xxxs:grid-cols-2 xs:grid-cols-3 relative grid w-full grid-cols-1 place-items-center gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-3",
        )}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={i}
            className="loading-skeleton"
            style={{
              width: "100%",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export { LoadingColumn, LoadingRow };
