"use client";

import { useState } from "react";
import { toast } from "sonner";
import CoverCard from "~/components/cover-card";
import { api } from "~/trpc/react";

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
    stories: {
      id: string;
      description: string;
      slug: string;
      title: string;
      thumbnail: string;
      tags: string[];
      is_premium: boolean;
      category: string | null;
      is_mature: boolean;
      reads: number;
      author: {
        profile: string | null;
        name: string | null;
      };
      chapters: {
        id: string;
        title: string | null;
        slug: string | null;
        createdAt: Date;
      }[];
    }[];
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

      toast.success("Story removed from reading list");
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
