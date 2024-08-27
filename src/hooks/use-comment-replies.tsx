import { useState } from "react";
import { api } from "~/trpc/react";

const useCommentReplies = (storyId: string, commentId: string) => {
  const [showReplies, setShowReplies] = useState(false);
  const { data: replies, isLoading } = api.comments.getReplies.useQuery(
    { commentId },
    { enabled: showReplies },
  );

  const { mutateAsync, status: commenting } =
    api.comments.addStoryComment.useMutation();

  const [content, setContent] = useState("");

  const handleSubmit = async (cId: string) => {
    void mutateAsync({ content, commentId: cId, storyId });
  };

  return {
    showReplies,
    content,
    commenting: commenting === "pending",
    handleSubmit,
    setContent,
    setShowReplies,
    replies,
    isLoading,
  };
};

export default useCommentReplies;
