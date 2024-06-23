"use client";

import { Plus, PlusSquare } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";

import { createRef, useEffect, useState } from "react";
import { v4 } from "uuid";
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
  const [readingLists, setReadingLists] = useState<
    {
      id: string;
      title: string;
    }[]
  >([]);

  useEffect(() => {
    void (async () => {
      const readingList = localStorage.getItem("readingList");

      if (readingList) {
        setReadingLists(JSON.parse(readingList));
      } else {
        const myReadingListId = v4();

        localStorage.setItem(
          "readingList",
          JSON.stringify([
            {
              id: myReadingListId,
              title: "My Reading List",
            },
          ]),
        );

        setReadingLists([
          {
            id: myReadingListId,
            title: "My Reading List",
          },
        ]);
      }
    })();
  }, []);

  const { mutateAsync } = api.story.addToReadingList.useMutation();

  const addReadingList = async (listId: string, newTitle?: string) => {
    try {
      if (!user) {
        toast({
          title: "You need to be logged in to add a story to a reading list",
        });
        return;
      }

      const res = await mutateAsync({
        readingListId: listId,
        storyId: bookId,
        newListTitle: newTitle,
      });

      if (res) {
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

  const handleSubmit = () => {
    try {
      const newTitle = inputRef.current?.value;

      const newId = v4();

      if (newTitle?.trim()) {
        addReadingList(newId, newTitle.trim());
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }

      localStorage.setItem(
        "readingList",
        JSON.stringify([
          ...readingLists,
          {
            id: newId,
            title: newTitle,
          },
        ]),
      );

      setReadingLists([
        ...readingLists,
        {
          id: newId,
          title: newTitle ?? "New Reading lists",
        },
      ]);
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
          <PlusSquare size={16} />
          <span>Reading List</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Reading List</DialogTitle>
          <DialogDescription className="text-base">
            Select a reading list to add this story to or create a new list.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2">
          <h1>Available Lists</h1>

          <div className="mb-2">
            <Select
              onValueChange={(data) => {
                const listId = readingLists.filter(
                  (list) => list.title === data,
                )[0]?.id!;
                addReadingList(listId);
              }}
            >
              <SelectTrigger className="bg-white outline-none focus:ring-0 focus:ring-transparent focus:ring-offset-0">
                <SelectValue placeholder="Select a reading list" />
              </SelectTrigger>

              <SelectContent className="w-full bg-white">
                <SelectGroup>
                  {readingLists.map((list, index) => (
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

              <DialogClose asChild>
                <Button type="submit" className="h-10 w-12" size={"icon"}>
                  <Plus size={16} />
                </Button>
              </DialogClose>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReadingListModel;
