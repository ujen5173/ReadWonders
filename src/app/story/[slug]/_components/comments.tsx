"use client";

import { useRef } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";
import CommentCard from "./comment-card";

const Comments = ({ storyId }: { storyId: string }) => {
  const commentRef = useRef<HTMLInputElement | null>(null);
  const { mutateAsync } = api.comments.addStoryComment.useMutation();
  const {
    data: comments,
    status,
    refetch,
  } = api.comments.getAll.useQuery(
    { storyId },
    {
      refetchOnWindowFocus: false,
    },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (commentRef.current?.value) {
      await mutateAsync({
        content: commentRef.current.value,
        storyId,
      });
      void refetch();
    }
  };

  return (
    <div>
      <div>
        <form className="mb-6 flex items-center gap-2" onSubmit={handleSubmit}>
          <Input ref={commentRef} placeholder="Write a comment..." />
          <Button type="submit" variant={"default"}>
            Send
          </Button>
        </form>
      </div>

      <div className="space-y-4">
        {status === "pending" ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-2">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="mb-2 h-4 w-20" />
                <Skeleton
                  className="mb-2 h-4"
                  style={{
                    width: Math.random() * 30 + 30 + "%",
                  }}
                />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-10" />
                  <Skeleton className="h-4 w-10" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <>
            {(comments ?? []).length > 0 ? (
              comments?.map((comment) => (
                <CommentCard
                  key={comment.id}
                  storyId={storyId}
                  comment={comment}
                />
              ))
            ) : (
              <p className="text-center text-base text-foreground sm:text-lg">
                No comments yet, be the first to comment!
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Comments;
