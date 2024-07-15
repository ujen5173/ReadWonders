import { useState } from "react";
import { api } from "~/trpc/react";

const useCommentReplies = (storyId: string, commentId: string) => {
  const [showReplies, setShowReplies] = useState(false);
  const { data: replies, isLoading } = api.comments.getReplies.useQuery(
    { commentId },
    { enabled: showReplies },
  );

  const { mutateAsync, isLoading: commenting } =
    api.comments.addStoryComment.useMutation();

  const [content, setContent] = useState("");
  const handleSubmit = async (cId: string) => {
    mutateAsync({ content, commentId: cId, storyId });
  };

  return {
    showReplies,
    content,
    commenting,
    handleSubmit,
    setContent,
    setShowReplies,
    replies,
    isLoading,
  };
};

export default useCommentReplies;
