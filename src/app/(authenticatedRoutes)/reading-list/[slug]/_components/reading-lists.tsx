"use client";

import { useState } from "react";
import CoverCard from "~/components/cover-card";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import { TCard } from "~/types";

const ReadingLists = ({
  data,
  listSlug,
}: {
  listSlug: string;
  data: {
    id: string;
    title: string;
    author: {
      profile: string | null;
      name: string | null;
      bio: string | null;
    };
    stories: TCard[];
  };
}) => {
  const [list, setList] = useState(data.stories);
  const { mutateAsync, isLoading } =
    api.story.removeReadingListStory.useMutation();

  const removeFromList = async (id: string) => {
    const res = await mutateAsync({
      readingListSlug: listSlug,
      storyId: id,
    });

    if (res) {
      const updatedList = data.stories.filter((story) => story.id !== id);

      setList(updatedList);

      toast({
        title: "Story removed from reading list",
      });
    }
  };

  return (
    <>
      {list.length > 0 ? (
        <div className="border-b border-border py-6">
          <div className="relative grid w-full grid-cols-1 place-items-center gap-5 xxxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {list.map((story) => (
              <CoverCard
                readingList={true}
                removeFromList={removeFromList}
                removing={isLoading}
                details={story}
                key={story.id}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full border-b border-border py-20 text-center text-xl text-foreground">
          No stories in this reading list
        </div>
      )}
    </>
  );
};

export default ReadingLists;
