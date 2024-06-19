"use client";

import { PopoverClose } from "@radix-ui/react-popover";
import { Plus, PlusSquare } from "lucide-react";
import { createRef, useEffect, useState } from "react";
import { v4 } from "uuid";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { api } from "~/trpc/react";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { toast } from "./ui/use-toast";

const ReadingListButton = ({ bookId }: { bookId: string }) => {
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
      console.log({ error });
    }
  };

  const inputRef = createRef<HTMLInputElement>();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const newTitle = inputRef.current?.value;
      const newId = v4();
      if (newTitle) {
        addReadingList(newId, newTitle);
        inputRef.current.value = "";
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
      console.log({ error });
      toast({
        title: "Failed to add story to reading list",
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" className="w-full gap-2">
          <PlusSquare size={16} />
          <span>Reading List</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-white">
        <div className="grid gap-2">
          <div className="space-y-2">
            <h4 className="text-lg font-medium leading-none">Reading Lists</h4>
            <p className="text-sm text-muted-foreground">
              Select a reading list to add this story to or create a new list.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="mb-2">
              <ScrollArea className="h-full max-h-40">
                {readingLists.map((list, index) => (
                  <>
                    <PopoverClose
                      key={list.id}
                      onClick={() => addReadingList(list.id)}
                      className="my-1 w-full cursor-pointer"
                    >
                      <div className="w-full rounded-md p-2 text-left text-base text-foreground hover:bg-slate-200">
                        {list.title}
                      </div>
                    </PopoverClose>
                    {readingLists.length === index + 1 ? null : <Separator />}
                  </>
                ))}
              </ScrollArea>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="New list title"
                  ref={inputRef}
                  className="col-span-2 h-8 bg-white"
                />
                <Button variant="secondary" size={"icon"} className="h-8">
                  <Plus size={16} />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ReadingListButton;
