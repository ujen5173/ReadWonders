"use client";

import { StarIcon } from "hugeicons-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import { cn } from "~/utils/cn";
import { formatNumber } from "~/utils/helpers";

const RatingButton = ({
  ratingDetails,
  storyId,
}: {
  ratingDetails: {
    ratingCount: number;
    ratingAverage: number;
  };
  storyId: string;
}) => {
  const [details, setDetails] = useState(ratingDetails);
  const { mutateAsync, isSuccess, isError } = api.story.rating.useMutation();

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Success",
        description: "Story rated successfully",
      });
    }
    if (isError) {
      toast({
        title: "Error",
        description: "An error occurred while rating the story",
      });
    }
  }, [isSuccess, isError]);

  const [rating, setRating] = useState(ratingDetails.ratingAverage);
  const [hover, setHover] = useState(0);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            title={details.ratingCount.toString()}
            variant={"secondary"}
            className="flex items-center gap-3"
          >
            <div className="flex items-center gap-[2px]">
              {[...Array(5)].map((_, index) => {
                index += 1;
                return (
                  <div
                    key={index}
                    onClick={async () => {
                      setRating(index);
                      const res = await mutateAsync({ rating: index, storyId });

                      if (res) {
                        setRating(res.averageRating);
                        setDetails({
                          ratingCount: res.ratingCount,
                          ratingAverage: res.averageRating,
                        });
                      }
                    }}
                    onMouseEnter={() => setHover(index)}
                    onMouseLeave={() => setHover(rating)}
                  >
                    <StarIcon
                      size={20}
                      className={cn(
                        "transition-colors duration-200 ease-in-out",
                        hover >= index || rating >= index
                          ? "fill-amber-400 text-transparent "
                          : "fill-gray-300 text-transparent",
                      )}
                      stroke="currentColor"
                    />
                  </div>
                );
              })}
            </div>

            <p className="text-foreground">
              {details.ratingAverage > 0
                ? details.ratingAverage.toFixed(1)
                : "..."}
            </p>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Total rating: {formatNumber(details.ratingCount)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RatingButton;
