"use client";

import {
  BookOpen,
  Eye,
  LayoutList,
  SquareArrowOutUpRight,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { Context } from "~/app/_components/RootContext";
import ReadingListButton from "~/components/reading-list-button";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
} from "~/components/ui/sheet";
import { cardHeight, cardWidth } from "~/server/constants";
import { api } from "~/trpc/react";
import { formatDate, formatNumber, formatReadingTime } from "~/utils/helpers";

const Story = () => {
  const router = useRouter();
  const { activeBook } = useContext(Context);

  const { mutateAsync } = api.story.addToReadingList.useMutation();

  const addToReadingList = async () => {
    try {
      console.log("Adding to reading list");
      // const res = await mutateAsync({
      //   storyId: activeBook?.id as string,
      // });
      // console.log({ res });
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <Sheet
      defaultOpen
      onOpenChange={(isOpen) => {
        if (!isOpen) router.back();
      }}
    >
      <SheetContent>
        <div className="flex h-full flex-col">
          <SheetHeader>
            <div className="flex justify-center gap-4 py-6">
              <div>
                <Image
                  src={activeBook?.thumbnail as string}
                  width={cardWidth}
                  height={cardHeight}
                  className="w-full rounded-md border border-border object-cover"
                  alt={activeBook?.title as string}
                  style={{
                    width: cardWidth / 1.85 + "px",
                    height: cardHeight / 2 + "px",
                  }}
                />
              </div>
              <div className="flex-1 text-left">
                <h1 className="text-2xl font-bold text-foreground">
                  {activeBook?.title}
                </h1>
                <p className="mb-2 text-base font-semibold text-slate-600">
                  By {activeBook?.author.name}
                </p>
                <Badge variant="secondary" className="border border-border/70">
                  {activeBook?.category}
                </Badge>
              </div>
            </div>
          </SheetHeader>
          <div
            className="relative"
            style={{
              height: "calc(100% - 203px)",
            }}
          >
            <ScrollArea type="always" className="h-full pr-3">
              <div className="">
                <div className="mb-8">
                  <h1 className="mb-2 text-lg font-semibold text-primary underline underline-offset-4">
                    About
                  </h1>
                  <SheetDescription className="text-base">
                    {activeBook?.description}
                  </SheetDescription>
                </div>
                <div className="mb-8">
                  <div className="xs: mb-2 flex flex-wrap items-center justify-center gap-1">
                    <div className="flex flex-col items-center px-2">
                      <div className="flex gap-2">
                        <Eye size={16} className="mt-1" />
                        <p>Reads</p>
                      </div>
                      <p className="font-bold">
                        {formatNumber(activeBook!.reads)}
                      </p>
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <div className="flex flex-col items-center px-2">
                      <div className="flex gap-2">
                        <Star size={16} className="mt-1" />
                        <p>Likes</p>
                      </div>
                      <p className="font-bold">
                        {formatNumber(activeBook!.reads / 4)}
                      </p>
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <div className="flex flex-col items-center px-2">
                      <div className="flex gap-2">
                        <LayoutList className="mt-1" size={16} />
                        <p>Chapters</p>
                      </div>
                      <p className="font-bold">{12}</p>
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <div className="flex flex-col items-center px-2">
                      <div className="flex gap-2">
                        <BookOpen className="mt-1" size={16} />
                        <p>Time</p>
                      </div>
                      <p className="font-bold">
                        {formatReadingTime(activeBook!.reads)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-8">
                  <h1 className="mb-2 text-lg font-semibold text-primary underline underline-offset-4">
                    Tags
                  </h1>
                  {(activeBook?.tags ?? []).length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {activeBook?.tags.map((tag) => (
                        <Badge
                          variant="secondary"
                          key={tag}
                          className="border border-border/70"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-lg text-slate-600">
                      This story has no tags.
                    </p>
                  )}
                </div>
                <div>
                  <h1 className="mb-2 text-lg font-semibold text-primary underline underline-offset-4">
                    Chapter
                  </h1>
                  {(activeBook?.chapter ?? []).length > 0 ? (
                    activeBook?.chapter.map((chapter) => (
                      <Link
                        key={chapter.id}
                        target="_blank"
                        href={`/chapter/${chapter.slug}`}
                        className="mb-4 block border-b border-border py-2 last:border-0"
                      >
                        <div className="flex cursor-pointer items-center justify-between">
                          <h2 className="text-lg font-semibold">
                            {chapter.title}
                          </h2>
                          <p className="text-base text-slate-600">
                            {formatDate(chapter.createdAt)}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-center text-lg text-slate-600">
                      No chapters written yet. <br /> Follow the author to get
                      updates.
                    </p>
                  )}
                </div>
              </div>
            </ScrollArea>
            <div className="absolute bottom-0 left-0 flex w-full flex-col items-center gap-2 bg-background pt-4 sm:flex-row">
              <Link
                className="w-full flex-1"
                href={`/story/${activeBook?.slug}`}
                target="_blank"
              >
                <Button className="w-full gap-2">
                  <span>Start Reading</span>
                  <SquareArrowOutUpRight size={16} />
                </Button>
              </Link>
              <div className="w-full flex-1">
                <ReadingListButton bookId={activeBook?.id as string} />
              </div>
              {/* <Button
                onClick={addToReadingList}
                className="w-full flex-1 gap-2"
                variant={"secondary"}
              >
                <PlusSquare size={16} />
                <span>Add to Reading List</span>
              </Button> */}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Story;
