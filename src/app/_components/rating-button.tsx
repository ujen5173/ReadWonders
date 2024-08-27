"use client";

import { StarIcon } from "hugeicons-react";
import { useEffect, useState } from "react";
import { Spinner } from "~/components/shared/Loading";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { toast } from "~/components/ui/use-toast";
import { getErrorMessage } from "~/lib/handle-errors";
import { formatNumber } from "~/lib/helpers";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

const RatingButton = ({
  ratingDetails,
  storyId,
}: {
  ratingDetails: {
    ratingCount: number;
    ratingAverage: number;
    userRating: number;
  };
  storyId: string;
}) => {
  const [details, setDetails] = useState(ratingDetails);
  const { status, mutateAsync, isSuccess, isError, error } =
    api.story.rating.useMutation();

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
        description: getErrorMessage(error),
      });
    }
  }, [isSuccess, isError, error]);

  const [rating, setRating] = useState(ratingDetails.ratingAverage);
  const [hover, setHover] = useState(0);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            title={details.ratingCount.toString()}
            variant="secondary"
            className="flex items-center gap-3"
          >
            <div className="flex items-center gap-[2px]">
              {Array(5).map((_, index) => {
                return (
                  <div
                    key={index + 1}
                    onClick={async () => {
                      const newRating = await mutateAsync({
                        rating: index + 1,
                        storyId,
                      });

                      setRating(newRating.averageRating);
                      setDetails({
                        ratingCount: newRating.ratingCount,
                        ratingAverage: newRating.averageRating,
                        userRating: index + 1,
                      });
                    }}
                    onMouseEnter={() => setHover(index + 1)}
                    onMouseLeave={() => setHover(rating)}
                  >
                    <StarIcon
                      size={20}
                      className={cn(
                        "transition-colors duration-200 ease-in-out",
                        hover >= index + 1 || rating >= index + 1
                          ? "fill-amber-400 text-transparent"
                          : "fill-gray-300 text-transparent",
                      )}
                      stroke="currentColor"
                    />
                  </div>
                );
              })}
            </div>

            <p className="text-foreground">
              {status === "pending" && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Spinner size={20} />
                </div>
              )}
              {details.ratingAverage > 0
                ? details.ratingAverage.toFixed(1)
                : "..."}
            </p>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Rating Count: {formatNumber(details.ratingCount)}.
            {details.userRating > 0 && `Your rating: ${details.userRating}`}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RatingButton;
