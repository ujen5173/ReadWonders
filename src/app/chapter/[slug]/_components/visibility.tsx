"use client";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { api } from "~/trpc/react";

const Visibility = ({ id, published }: { id: string; published: boolean }) => {
  const { mutate, isLoading } = api.chapter.changeVisibility.useMutation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button loading={isLoading} disabled={isLoading} variant={"secondary"}>
          Change Visibility
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full bg-white p-0">
        <DropdownMenuGroup>
          <DropdownMenuItem className="p-0">
            <Button
              className="w-full justify-start"
              variant={"ghost"}
              onClick={() => {
                mutate({ id: id, published: !published });
              }}
            >
              {published ? "Unpublish" : "Publish"}
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Visibility;
