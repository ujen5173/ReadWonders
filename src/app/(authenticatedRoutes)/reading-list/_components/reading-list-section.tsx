"use client";
import Image from "next/image";
import { api } from "~/trpc/react";

const ReadingListSection = ({ userId }: { userId: string }) => {
  const { data: readingLists, isLoading } = api.auth.readingLists.useQuery({
    authorId: userId,
  });

  console.log({ readingLists });

  return (
    <div className="flex gap-6">
      {readingLists?.map((readingList) => {
        return (
          <div key={readingList.id} className="w-1/3">
            <h2 className="text-2xl font-semibold text-primary">
              {readingList.title}
            </h2>
            <div className="mt-4 flex gap-4">
              {readingList.stories.map((story, index) => {
                return (
                  <div key={index} className="w-1/2">
                    <Image
                      src={story.thumbnail}
                      alt={"thumbnail"}
                      width={100}
                      height={100}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReadingListSection;
