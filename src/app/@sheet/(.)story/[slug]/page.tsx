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
import ReadingListModel from "~/app/_components/reading-list-modal";
import { Badge } from "~/components/ui/badge";
import { buttonVariants } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
} from "~/components/ui/sheet";
import { cardHeight, cardWidth } from "~/server/constants";
import { cn } from "~/utils/cn";
import { formatDate, formatNumber, formatReadingTime } from "~/utils/helpers";

const Story = () => {
  const router = useRouter();
  const { activeBook } = useContext(Context);

  const calcHeight = () => {
    const parent = document.querySelector(".book-cover-detail");

    if (!parent) return `calc(100% - 203px)`;

    const parentHeight = parent.clientHeight;
    const padding = "1.5rem";
    const buttonHeight = 40;

    return `calc(100% - ${parentHeight + 24 + buttonHeight}px + ${padding})`;
  };

  // console.log({ res: (activeBook?.chapters ?? []).length === 0 });

  return (
    <Sheet
      defaultOpen
      onOpenChange={(isOpen) => {
        if (!isOpen) router.back();
      }}
    >
      <SheetContent>
        <div className="flex h-full flex-col">
          <SheetHeader className="book-cover-detail">
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
                <h1 className="text-2xl font-medium text-foreground">
                  {activeBook?.title}
                </h1>
                <Link href={`/user/${activeBook?.author.username}`}>
                  <p className="mb-2 text-base font-semibold text-slate-600">
                    By{" "}
                    <span className="text-primary underline">
                      {activeBook?.author.name}
                    </span>
                  </p>
                </Link>
                <Link href={`/genre/${activeBook?.category}`}>
                  <SheetClose>
                    <Badge
                      variant="secondary"
                      className="border border-border/70"
                    >
                      {activeBook?.category}
                    </Badge>
                  </SheetClose>
                </Link>
              </div>
            </div>
          </SheetHeader>

          <div
            className="relative flex flex-1 flex-col overflow-auto"
            style={{
              height: calcHeight(),
            }}
          >
            <ScrollArea
              type="always"
              style={{
                height: "100%",
              }}
              className="pb-6 pr-3"
            >
              <div className="h-full">
                <div className="mb-6">
                  <h1 className="mb-2 text-lg font-semibold text-primary underline underline-offset-4">
                    About
                  </h1>
                  <p className="text-base">{activeBook?.description}</p>
                </div>

                <div className="mb-8">
                  <div className="mb-2 grid grid-cols-2">
                    <div className="flex flex-col items-center border-b border-border px-2 py-4">
                      <div className="flex gap-2">
                        <Eye size={16} className="mt-1" />
                        <p>Reads</p>
                      </div>
                      <p className="font-medium">
                        {formatNumber(activeBook?.reads ?? 0)}
                      </p>
                    </div>
                    <div className="flex flex-col items-center border-b border-l border-border px-2 py-4">
                      <div className="flex gap-2">
                        <Star size={16} className="mt-1" />
                        <p>Likes</p>
                      </div>
                      <p className="font-medium">
                        {formatNumber((activeBook?.reads ?? 0) / 4)}
                      </p>
                    </div>

                    <div className="flex flex-col items-center px-2 py-4">
                      <div className="flex gap-2">
                        <LayoutList className="mt-1" size={16} />
                        <p>Chapters</p>
                      </div>
                      <p className="font-medium">
                        {activeBook?.chapters.length}
                      </p>
                    </div>

                    <div className="flex flex-col items-center border-l border-border px-2 py-4">
                      <div className="flex gap-2">
                        <BookOpen className="mt-1" size={16} />
                        <p>Time</p>
                      </div>
                      <p className="font-medium">
                        {formatReadingTime(activeBook?.reads ?? 0)}
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
                    <p className="text-center text-base text-slate-600 sm:text-lg">
                      This story has no tags.
                    </p>
                  )}
                </div>

                <div>
                  <h1 className="mb-2 text-lg font-semibold text-primary underline underline-offset-4">
                    Chapter
                  </h1>

                  {(activeBook?.chapters ?? []).length > 0 ? (
                    activeBook?.chapters.map((chapter) => (
                      <Link
                        key={chapter.id}
                        target="_blank"
                        href={`/chapter/${chapter.slug}`}
                        className="w-full"
                      >
                        <div className="flex items-center justify-between rounded-md p-2 hover:bg-rose-400/40">
                          <p className="line-clamp-1 text-base text-slate-700">
                            {chapter.title}
                          </p>
                          <p className="xs:text-md whitespace-nowrap text-sm text-slate-500">
                            {formatDate(chapter.createdAt)}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-center text-base text-slate-600 sm:text-lg">
                      No chapters written yet. <br /> Follow the author to get
                      updates.
                    </p>
                  )}
                </div>
              </div>
            </ScrollArea>

            <div className="mt-4 flex w-full flex-col items-center gap-2 bg-background px-2 pb-2 xxs:flex-row">
              <SheetClose
                disabled
                onClick={() => {
                  if (
                    activeBook &&
                    activeBook.chapters &&
                    activeBook.chapters.length > 0
                  ) {
                    router.push(`/chapter/${activeBook.chapters[0]?.slug}`);
                  }
                }}
                className={cn(buttonVariants({ variant: "default" }), "flex-1")}
              >
                <span>Start Reading</span>
                <SquareArrowOutUpRight size={16} />
              </SheetClose>
              <div className="flex-1">
                <ReadingListModel bookId={activeBook?.id as string} />
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Story;
