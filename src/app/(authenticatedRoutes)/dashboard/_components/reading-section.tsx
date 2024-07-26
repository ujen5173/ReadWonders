"use client";

import { ArrowDown02Icon } from "hugeicons-react";
import ReadingListSection from "~/app/reading-list/_components/reading-list-section";
import { Skeleton } from "~/components/ui/skeleton";
import { useUser } from "~/providers/AuthProvider/AuthProvider";
import { cardHeight } from "~/server/constants";
import { cn } from "~/utils/cn";

const ReadingSection = () => {
  const { user, isLoading } = useUser();

  if (!user) return <ReadingSectionLoading isLoading={isLoading} />;

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between gap-4">
        <div className="mb-4 flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-primary">Reading List</h1>
          <ArrowDown02Icon size={20} className="text-primary" />
        </div>
      </div>
      <ReadingListSection userId={user?.id} perRow={2} />
    </div>
  );
};

export default ReadingSection;

const ReadingSectionLoading = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between gap-4">
        <div className="mb-4 flex items-center gap-2">
          <Skeleton style={{ height: "32px", width: "200px" }} />
        </div>
      </div>
      <div
        className={cn(
          "grid grid-cols-1 gap-5 xs:grid-cols-2 lg:grid-cols-3",
          "xl:grid-cols-2",
        )}
      >
        {!isLoading &&
          Array.from({ length: 2 }).map((_, index) => (
            <Skeleton
              style={{
                height: cardHeight / 1.4 + 32 + 44 + "px",
                width: "100%",
              }}
              className="rounded-2xl"
              key={index}
            />
          ))}
      </div>
    </div>
  );
};
