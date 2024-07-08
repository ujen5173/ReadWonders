"use client";

import { PlusSignSquareIcon, Tick01Icon } from "hugeicons-react";
import { api } from "~/trpc/react";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

const FollowButton = ({
  id,
  isAuth,
  following,
}: {
  id: string;
  isAuth: boolean;
  following: boolean;
}) => {
  const { mutate, isLoading } = api.auth.follow.useMutation();

  return (
    <Button
      loading={isLoading}
      disabled={isLoading}
      className="gap-1"
      onClick={() => {
        if (isAuth) mutate({ authorId: id });
        else toast({ title: "You need to be logged in to follow users" });
      }}
    >
      {following ? (
        <>
          {!isLoading && <Tick01Icon className="size-4 stroke-2" />}
          Following
        </>
      ) : (
        <>
          {!isLoading && <PlusSignSquareIcon className="size-4 stroke-2" />}
          Follow
        </>
      )}
    </Button>
  );
};

export default FollowButton;
