"use client";

import { FavouriteIcon } from "hugeicons-react";
import { useEffect, useState } from "react";
import { buttonVariants } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { api } from "~/trpc/react";
import { cn } from "~/utils/cn";
import { formatNumber } from "~/utils/helpers";

const LikeStory = ({ id, love }: { id: string; love: number }) => {
  const { data: hasLiked } = api.story.hasLiked.useQuery(
    { storyId: id },
    {
      refetchOnWindowFocus: false,
    },
  );

  const [liked, setLiked] = useState(!!hasLiked);

  useEffect(() => {
    if (hasLiked !== undefined) setLiked(hasLiked);
  }, [hasLiked]);

  const { mutateAsync } = api.story.love.useMutation();

  return (
    <TooltipProvider delayDuration={20}>
      <Tooltip>
        <TooltipTrigger
          onClick={async () => {
            setLiked((prev) => !prev);
            await mutateAsync({ story: id });
          }}
          className={cn(
            buttonVariants({
              variant: liked ? "blue" : "outline",
            }),
            "gap-2",
          )}
        >
          <FavouriteIcon className="size-4" />
          {love > 0 && formatNumber(love)}
        </TooltipTrigger>
        <TooltipContent>{liked ? "Unlike" : "Like"}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LikeStory;
