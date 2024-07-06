"use client";

import { PlusSquare } from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "./ui/button";

const FollowButton = ({ id, username }: { id: string; username: string }) => {
  const { mutate, isLoading } = api.auth.follow.useMutation();

  return (
    <Button
      loading={isLoading}
      className="gap-1"
      onClick={() => {
        mutate({ authorId: id });
      }}
    >
      <PlusSquare className="size-4" />
      <span>Follow {username}</span>
    </Button>
  );
};

export default FollowButton;
