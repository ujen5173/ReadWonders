"use client";

import { Bookmark02Icon } from "hugeicons-react";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

const AddToBookmark = ({ slug }: { slug: string }) => {
  const { mutateAsync, isLoading } = api.auth.bookmark.useMutation();

  return (
    <Button
      onClick={async () => {
        await mutateAsync({ slug });
        toast({
          title: "Story added to bookmark",
        });
      }}
      loading={isLoading}
      disabled={isLoading}
      className="w-full"
      variant="secondary"
    >
      {!isLoading && <Bookmark02Icon className="size-4" />}
      Add to Bookmark
    </Button>
  );
};

export default AddToBookmark;
