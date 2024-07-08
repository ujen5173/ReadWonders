"use client";

import { PlusSignIcon } from "hugeicons-react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

const UpVote = ({ chapter }: { chapter: string }) => {
  const { mutate, isLoading } = api.chapter.love.useMutation();

  return (
    <Button
      onClick={() => {
        mutate({
          chapter,
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
