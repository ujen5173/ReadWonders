"use client";

import {
  BookOpen01Icon,
  FavouriteIcon,
  LeftToRightListNumberIcon,
  LinkSquare01Icon,
  SquareLock02Icon,
  ViewIcon,
} from "hugeicons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import slugify from "slugify";
import { Context } from "~/components/context/root-context";
import ReadingListModel from "~/components/shared/reading-list-modal";
import { Badge } from "~/components/ui/badge";
import { Button, buttonVariants } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader } from "~/components/ui/sheet";
import { contentFont } from "~/config/font";
import { formatDate, formatNumber, formatReadingTime } from "~/lib/helpers";
import { cn } from "~/lib/utils";
import { cardHeight, cardWidth, slugy } from "~/server/constants";

const Story = () => {
  const router = useRouter();
  const { activeBook } = useContext(Context);

  const [open, setOpen] = useState(true);

  const calcHeight = () => {
    const parent = document.querySelector(".book-cover-detail");

    if (!parent) return `calc(100% - 203px)`;

    const parentHeight = parent.clientHeight;
    const padding = "1.5rem";
    const buttonHeight = 40;

    return `calc(100% - ${parentHeight + 24 + buttonHeight}px + ${padding})`;
  };

  const [showMore, setShowMore] = useState(true);

  if (!activeBook) return null;

  return (
    <Sheet
      defaultOpen
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(open);
        if (!isOpen) router.back();
      }}
    >
      <SheetContent>
        <div className="flex h-full flex-col">
          <SheetHeader className="book-cover-detail">
            <div className="flex justify-center gap-4 py-6">
              <div>
                <Image
                  src={activeBook?.thumbnail}
                  width={cardWidth}
                  height={cardHeight}
                  className="w-full rounded-md border border-border object-cover"
                  alt={activeBook?.title}
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

                <Link
                  href={`/user/${activeBook?.author.username}`}
                  onClick={() => setOpen(false)}
                >
                  <p className="mb-2 text-base font-semibold text-slate-600">
                    By{" "}
                    <span className="text-primary underline">
                      {activeBook?.author.name}
                    </span>
                  </p>
                </Link>
                <Link
                  href={`/genre/${slugify(activeBook?.categoryName ?? "", slugy)}`}
                  onClick={() => setOpen(false)}
                >
                  <Badge
                    variant="secondary"
                    className="border border-border/70"
                  >
                    {activeBook?.categoryName}
                  </Badge>
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
            <ScrollArea type="always" className="h-full pb-6 pr-3">
              <div className="h-full">
                <div className="mb-6">
                  <h1 className="mb-2 text-lg font-semibold text-primary underline underline-offset-4">
                    About
                  </h1>
                  <article
                    className={`max-w-none whitespace-pre-line ${contentFont.className}`}
                  >
                    <p className="text-base">
                      {!showMore
                        ? activeBook?.description
                        : activeBook?.description.slice(0, 500)}
                    </p>
                    {(activeBook?.description ?? "").length > 500 && (
                      <button
                        onClick={() => setShowMore(!showMore)}
                        className="mt-4 text-primary underline"
                      >
                        {showMore ? "Show more" : "Show less"}
                      </button>
                    )}
                  </article>
                </div>

                <div className="mb-8">
                  <div className="mb-2 grid grid-cols-2">
                    <div className="flex flex-col items-center border-b border-border px-2 py-4">
                      <div className="flex gap-2">
                        <ViewIcon size={16} className="mt-1 stroke-2" />
                        <p>Reads</p>
                      </div>
                      <p className="font-medium">
                        {formatNumber(activeBook?.reads ?? 0)}
                      </p>
                    </div>

                    <div className="flex flex-col items-center border-b border-l border-border px-2 py-4">
                      <div className="flex gap-2">
                        <FavouriteIcon size={16} className="mt-1" />
                        <p>Likes</p>
                      </div>
                      <p className="font-medium">
                        {formatNumber(activeBook?.love ?? 0)}
                      </p>
                    </div>

                    <div className="flex flex-col items-center px-2 py-4">
                      <div className="flex gap-2">
                        <LeftToRightListNumberIcon className="mt-1" size={16} />
                        <p>Chapters</p>
                      </div>
                      <p className="font-medium">
                        {(activeBook?.chapters ?? []).length}
                      </p>
                    </div>

                    <div className="flex flex-col items-center border-l border-border px-2 py-4">
                      <div className="flex gap-2">
                        <BookOpen01Icon className="mt-1" size={16} />
                        <p>Time</p>
                      </div>
                      <p className="font-medium">
                        {formatReadingTime(activeBook?.readingTime ?? 0)}
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
                    activeBook?.chapters
                      .sort((a, b) => a.sn - b.sn)
                      .map((chapter) => (
                        <Link
                          key={chapter.id}
                          href={`/chapter/${chapter.slug}`}
                          className="w-full"
                          onClick={() => setOpen(false)}
                        >
                          <div className="flex items-center justify-between rounded-md p-2 hover:bg-rose-400/40">
                            <p className="line-clamp-1 text-base text-slate-700">
                              {chapter.title}
                            </p>
                            <div className="flex items-center gap-2">
                              {chapter.isPremium && (
                                <span>
                                  <SquareLock02Icon size={16} />
                                </span>
                              )}
                              <p className="xs:text-md whitespace-nowrap text-sm text-slate-500">
                                {formatDate(chapter.createdAt)}
                              </p>
                            </div>
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

            <div className="mt-4 flex w-full flex-wrap items-center gap-2 bg-background px-2 pb-2">
              <Link
                target="_blank"
                href={`/story/${activeBook?.slug}`}
                className="flex-1"
              >
                <Button
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "w-full gap-2",
                  )}
                >
                  <span className="whitespace-nowrap">View Details</span>
                  <LinkSquare01Icon size={16} className="stroke-2" />
                </Button>
              </Link>

              <div className="flex-1">
                <ReadingListModel bookId={activeBook?.id} />
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Story;
