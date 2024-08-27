"use client";

import ReadingListCard from "~/app/_components/reading-list/reading-list-card";
import { Skeleton } from "~/components/ui/skeleton";
import { toast } from "~/components/ui/use-toast";
import { cn } from "~/lib/utils";
import { cardHeight } from "~/server/constants";
import { api } from "~/trpc/react";

const ReadingListSection = ({
  perRow = 4,
  userId,
  showActions = false,
}: {
  perRow?: 2 | 4;
  userId?: string;
  showActions?: boolean;
}) => {
  const {
    data: readingLists,
    isLoading,
    refetch,
  } = api.auth.readingLists.useQuery(
    {
      authorId: userId,
      limit: perRow,
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const { mutateAsync } = api.auth.deleteReadingList.useMutation();
  const { mutateAsync: editMutate } = api.auth.editReadingList.useMutation();

  const onDeleteConfirm = async (id: string) => {
    const res = await mutateAsync({ readingListId: id });

    if (res) void refetch();

    toast({
      title: "Reading list deleted successfully",
    });
  };

  const onEditConfirm = async (
    id: string,
    title: string,
    description: string | null,
  ) => {
    const res = await editMutate({
      readingListId: id,
      title: title,
      description: description,
    });

    if (res) void refetch();

    toast({
      title: "Reading list updated successfully",
    });
  };

  return (
    <div
      className={cn(
        "xs:grid-cols-2 grid grid-cols-1 gap-5 lg:grid-cols-3",
        perRow === 2
          ? "xl:grid-cols-2"
          : "border-b border-border pb-8 xl:grid-cols-4",
      )}
    >
      {isLoading ? (
        Array.from({ length: perRow }).map((_, index) => (
          <Skeleton
            style={{
              height: cardHeight / 1.4 + 32 + 44 + "px",
              width: "100%",
            }}
            className="rounded-2xl"
            key={index}
          />
        ))
      ) : (
        <>
          {readingLists?.map((readingList) => (
            <ReadingListCard
              key={readingList.id}
              showActions={showActions}
              readingList={readingList}
              onEditConfirm={onEditConfirm}
              onDeleteConfirm={onDeleteConfirm}
            />
          ))}
        </>
      )}
      {Array(Math.abs(perRow - (readingLists ?? []).length))
        .fill(0)
        .map((_, i) => (
          <div className="mx-auto block flex-1" key={i} />
        ))}

      {perRow === 2 && Math.abs(perRow - (readingLists ?? []).length) === 0 && (
        <>
          <div className="mx-auto hidden flex-1 md:block lg:hidden"></div>
          <div className="mx-auto hidden flex-1 md:block xl:hidden"></div>
        </>
      )}
    </div>
  );
};

export default ReadingListSection;
