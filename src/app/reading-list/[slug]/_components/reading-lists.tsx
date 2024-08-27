"use client";

import { useContext, useState } from "react";
import { Context } from "~/components/context/root-context";
import CoverCard from "~/components/shared/cover-card";
import { toast } from "~/components/ui/use-toast";
import { type TCard } from "~/types";

const ReadingLists = ({
  data,
}: {
  data: {
    id: string;
    title: string;
    author: {
      profile: string | null;
      name: string | null;
      bio: string | null;
    };
    stories: (TCard & { readingList: boolean })[];
  };
}) => {
  const [list, setList] = useState(data.stories);
  const { removeFromList } = useContext(Context);
  const [loading, setLoading] = useState(false);

  const remove = async (id: string) => {
    setLoading(true);

    try {
      const res = await removeFromList(id);

      if (res) {
        const updatedList = data.stories.filter((story) => story.id !== id);

        setList(updatedList);

        toast({
          title: "Story removed from reading list",
        });
      }
    } catch (err) {
      toast({
        title: "Something went wrong! Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {list.length > 0 ? (
        <div className="border-b border-border py-6">
          <div className="relative grid w-full grid-cols-1 place-items-center gap-5 xxxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {list.map((story) => (
              <CoverCard
                removeFromList={remove}
                removing={loading}
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
