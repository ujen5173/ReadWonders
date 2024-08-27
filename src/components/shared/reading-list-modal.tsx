"use client";

import { PlusSignIcon, PlusSignSquareIcon } from "hugeicons-react";
import { useSession } from "next-auth/react";
import { createRef } from "react";
import { v4 } from "uuid";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import { Spinner } from "./Loading";

const ReadingListModel = ({ bookId }: { bookId: string }) => {
  const { data } = useSession();

  const { data: readingList, refetch } = api.auth.readingListNames.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    },
  );

  const { mutateAsync, status } = api.story.addToReadingList.useMutation();

  const addReadingList = async (listId: string, newTitle?: string) => {
    try {
      if (!data) {
        toast({
          title: "You need to be logged in to add a story to a reading list",
        });

        return;
      }

      if (!listId) {
        toast({
          title: "No id",
        });

        return;
      }

      const res = await mutateAsync({
        readingListId: listId,
        storyId: bookId,
        newListTitle: newTitle,
      });

      if (res) {
        void refetch();

        toast({
          title: "Story added to reading list",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to add story to reading list",
      });
    }
  };

  const inputRef = createRef<HTMLInputElement>();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const newTitle = inputRef.current?.value;

      const newId = v4();

      if (newTitle?.trim()) {
        void addReadingList(newId, newTitle.trim());
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }

      void refetch();
    } catch (error) {
      toast({
        title: "Failed to add story to reading list",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full gap-2">
          <PlusSignSquareIcon size={16} />
          <span className="whitespace-nowrap">Reading List</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Reading List</DialogTitle>
          {data && (
            <DialogDescription className="text-base">
              Select a reading list to add this story to or create a new list.
            </DialogDescription>
          )}
        </DialogHeader>

        {data ? (
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <h1>Available Lists</h1>
              {status === "pending" ? (
                <Spinner className="size-4 text-black" />
              ) : null}
            </div>

            <div className="">
              <Select
                onValueChange={(data) => {
                  const list = (readingList ?? []).find(
                    (l) => l.title === data,
                  );
                  const listId = list?.id;

                  if (listId) {
                    void addReadingList(listId);
                  }
                }}
              >
                <SelectTrigger className="bg-white outline-none focus:ring-0 focus:ring-transparent focus:ring-offset-0">
                  <SelectValue placeholder="Select a reading list" />
                </SelectTrigger>

                <SelectContent className="w-full bg-white">
                  <SelectGroup>
                    {(readingList ?? []).map((list, index) => (
                      <SelectItem key={index} value={list.title}>
                        {list.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <span className="text-center">Or</span>

            <form onSubmit={handleSubmit}>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="New list title"
                  ref={inputRef}
                  className="h-10 bg-white"
                />

                <Button type="submit" className="h-10 w-12" size={"icon"}>
                  <PlusSignIcon size={16} />
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <DialogDescription className="rounded-md bg-primary/80 p-3 text-center text-base text-white">
            You need to be logged in to add a story to a reading list.
          </DialogDescription>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReadingListModel;
