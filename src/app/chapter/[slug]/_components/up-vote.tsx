"use client";

import { PlusSignIcon } from "hugeicons-react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

const UpVote = ({ story }: { story: string }) => {
  const { mutate, isLoading } = api.story.love.useMutation();

  return (
    <Button
      onClick={() => {
        mutate({
          story,
        });
      }}
      variant="secondary"
      loading={isLoading}
    >
      {!isLoading && <PlusSignIcon size={16} />}
      <span>Up Vote</span>
    </Button>
  );
};

export default UpVote;
