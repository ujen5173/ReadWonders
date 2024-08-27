"use client";

import { PlusSignSquareIcon, Tick01Icon } from "hugeicons-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

const FollowButton = ({
  id,
  isAuth,
  following,
}: {
  id: string;
  isAuth: boolean;
  following: boolean;
}) => {
  const [isFollowing, setIsFollowing] = useState(following);
  const { mutate } = api.auth.follow.useMutation();

  return (
    <Button
      className="gap-1"
      onClick={() => {
        if (isAuth) {
          setIsFollowing(!isFollowing);
          mutate({ authorId: id });
        } else toast({ title: "You need to be logged in to follow users" });
      }}
    >
      {isFollowing ? (
        <>
          <Tick01Icon className="size-4 stroke-2" />
          Following
        </>
      ) : (
        <>
          <PlusSignSquareIcon className="size-4 stroke-2" />
          Follow
        </>
      )}
    </Button>
  );
};

export default FollowButton;
