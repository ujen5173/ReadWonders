import Image from "next/image";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { TComment } from "~/types";
import { cn } from "~/utils/cn";
import { formatDate } from "~/utils/helpers";
import useCommentReplies from "./hooks/use-comment-replies";

const CommentCard = ({
  storyId,
  comment,
}: {
  storyId: string;
  comment: TComment;
}) => {
  const {
    showReplies,
    content,
    setContent,
    handleSubmit,
    setShowReplies,
    replies,
    isLoading,
    commenting,
  } = useCommentReplies(storyId, comment.id);
  const [reply, setReply] = useState(false);

  return (
    <div className="flex gap-2">
      <Image
        src={comment.user.profile!}
        alt={comment.user.profile!}
        width={120}
        draggable={false}
        height={120}
        className="size-10 rounded-full"
      />
      <div className="flex-1">
        <div className="mb-2 flex items-center gap-2">
          <h1 className="text-base font-medium">{comment.user.username}</h1>
          {comment.user.id === "12345-12345-12345" && (
            <Badge className="text-xs" variant="default">
              Author
            </Badge>
          )}
        </div>
        <p className={cn("mb-4 text-base font-medium")}>{comment.content}</p>
        <div className="mb-2 flex items-center gap-3">
          <span className="text-sm">
            {formatDate(new Date(comment.createdAt))}
          </span>
          <Separator className="h-5" orientation="vertical" />
          <button
            onClick={() => {
              setReply(true);
              setShowReplies(true);
            }}
            className={cn("text-sm font-medium text-primary hover:underline")}
          >
            Reply
          </button>
        </div>
        {!showReplies && comment.childrenCount > 0 && (
          <button
            onClick={() => {
              setShowReplies(!showReplies);
            }}
            className="text-sm font-semibold"
          >
            View {comment.childrenCount} Replies
          </button>
        )}

        {reply && (
          <div className="mt-6">
            <form
              className="mb-6 flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setContent("");
                handleSubmit(comment.id);
              }}
            >
              <Input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                autoFocus
                placeholder={`Reply to @${comment.user.username}`}
              />
              <Button type="submit" loading={commenting} variant={"default"}>
                Send
              </Button>
            </form>
          </div>
        )}

        {showReplies && (
          <div className="">
            {isLoading ? (
              <p>Loading replies...</p>
            ) : (
              replies &&
              replies.length > 0 &&
              replies.map((r) => (
                <div
                  key={r.id}
                  className="mt-4 border-b border-border pb-2 last:border-0"
                >
                  <CommentCard storyId={storyId} comment={r} />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
