"use client";

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

import { PlusSignIcon, PlusSignSquareIcon } from "hugeicons-react";
import { createRef } from "react";
import { v4 } from "uuid";
import { Spinner } from "~/components/Loading";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { toast } from "~/components/ui/use-toast";
import { useUser } from "~/providers/AuthProvider/AuthProvider";
import { api } from "~/trpc/react";

const ReadingListModel = ({ bookId }: { bookId: string }) => {
  const { user } = useUser();

  const { data: readingList, refetch } = api.auth.readingListNames.useQuery();

  const { mutateAsync, isLoading } = api.story.addToReadingList.useMutation();

  const addReadingList = async (listId: string, newTitle?: string) => {
    try {
      if (!user) {
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
        refetch();

        toast({
          title: "Story added to reading list",
        });
      }
    } catch (error) {
      console.log({ error });
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
        addReadingList(newId, newTitle.trim());
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }

      refetch();
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
          <DialogDescription className="text-base">
            Select a reading list to add this story to or create a new list.
          </DialogDescription>
        </DialogHeader>

        {user ? (
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <h1>Available Lists</h1>
              {isLoading ? <Spinner className="size-4 text-black" /> : null}
            </div>

            <div className="">
              <Select
                onValueChange={(data) => {
                  const list = (readingList ?? []).find(
                    (l) => l.title === data,
                  );
                  const listId = list?.id;

                  if (listId) {
                    addReadingList(listId);
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
