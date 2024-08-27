"use client";

import { useState } from "react";
import DeleteDialog from "~/app/_components/dialogs/delete-dialog";
import { Spinner } from "~/components/shared/Loading";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

const Visibility = ({ id, published }: { id: string; published: boolean }) => {
  const [hasPublished, setHasPublished] = useState(published);
  const { mutateAsync, status } = api.chapter.changeVisibility.useMutation();
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={(op) => setOpen(op)}>
      <DropdownMenuTrigger asChild>
        <Button disabled={status === "pending"} variant="secondary">
          {status === "pending" && (
            <Spinner className="size-5 text-slate-700" />
          )}
          Change Visibility
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full bg-white p-0">
        <DropdownMenuGroup>
          <div className="p-0">
            <DeleteDialog
              style="w-full justify-start"
              variant="ghost"
              buttonTitle={hasPublished ? "Unpublish" : "Publish"}
              title={
                hasPublished
                  ? "Are you sure you want to Unpublish this chapter"
                  : "Are you sure you want to Publish this chapter"
              }
              description={
                hasPublished
                  ? "Unpublishing this chapter will remove it from public view and it will no longer be accessible to users."
                  : "Publishing this chapter will make it visible to users."
              }
              onConfirm={async () => {
                setHasPublished(!published);
                setOpen(false);
                await mutateAsync({ id: id, published: !hasPublished });
                toast({
                  title: hasPublished
                    ? "Chapter Unpublished"
                    : "Chapter Published",
                });
              }}
            />
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Visibility;
