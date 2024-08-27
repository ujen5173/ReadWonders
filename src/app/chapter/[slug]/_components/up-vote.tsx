"use client";

import { PlusSignIcon } from "hugeicons-react";
import { Spinner } from "~/components/shared/Loading";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

const UpVote = ({ story }: { story: string }) => {
  const { mutate, status } = api.story.love.useMutation();

  return (
    <Button
      onClick={() => {
        mutate({
          story,
        });
      }}
      variant="secondary"
      disabled={status === "pending"}
    >
      {status === "pending" ? (
        <Spinner className="size-5 text-slate-700" />
      ) : (
        <PlusSignIcon size={16} />
      )}
      <span>Up Vote</span>
    </Button>
  );
};

export default UpVote;
