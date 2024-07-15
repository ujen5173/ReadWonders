"use client";

import { useRef } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import CommentCard from "./comment-card";

const Comments = ({ storyId }: { storyId: string }) => {
  const commentRef = useRef<HTMLInputElement | null>(null);
  const { mutateAsync } = api.comments.addStoryComment.useMutation();
  const { data: comments, refetch } = api.comments.getAll.useQuery(
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
      refetch();
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

      <div>
        {(comments ?? []).length > 0 ? (
          comments?.map((comment) => (
            <CommentCard key={comment.id} storyId={storyId} comment={comment} />
          ))
        ) : (
          <p className="text-center text-lg text-foreground">
            No comments yet, be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default Comments;
