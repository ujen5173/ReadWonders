"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Edit01Icon, SquareLock02Icon } from "hugeicons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Spinner } from "~/components/shared/Loading";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/use-toast";
import { getErrorMessage } from "~/lib/handle-errors";
import { formatDate } from "~/lib/helpers";
import { api } from "~/trpc/react";
import { type ChapterCardWithPublish } from "~/types";
import DragItem from "./chapter-drag-item";

const Chapters = ({
  userId,
  storyDetails,
}: {
  userId: string | undefined;
  storyDetails: {
    id: string;
    slug: string;
    author: { id: string };
    chapters: ChapterCardWithPublish[];
  };
}) => {
  const router = useRouter();
  const { mutateAsync, status, isError, error } = api.chapter.new.useMutation();

  const chapters = useMemo(
    () =>
      storyDetails.chapters.filter((ch) => {
        if (ch.published === false && storyDetails.author.id === userId) {
          return true;
        } else if (ch.published === true) {
          return true;
        }

        return false;
      }),
    [storyDetails, userId],
  ).filter((ch) => ch.title && ch.slug);

  useEffect(() => {
    if (isError) {
      toast({
        title: getErrorMessage(error),
      });
    }
  }, [isError, error]);

  // DND
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [chs, setChs] = useState(chapters.sort((a, b) => a.sn - b.sn));
  const [hasDraged, setHasDraged] = useState(false);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over?.id) {
      setHasDraged(true);
      setChs((prevItems) => {
        const oldIndex = prevItems.findIndex((item) => item.id === active.id);
        const newIndex = prevItems.findIndex((item) => item.id === over.id);

        const updatedItems = arrayMove(prevItems, oldIndex, newIndex);

        // Update the sn for all items based on their new positions
        return updatedItems.map((item, index) => ({
          ...item,
          sn: index,
        }));
      });
    }
  }

  const {
    mutate: chapterIndexMutation,
    status: chapterIndexLoading,
    isError: isChapterIndexError,
    error: chapterIndexError,
    isSuccess,
  } = api.chapter.updateChapterIndex.useMutation();

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Chapters order updated successfully",
      });
    }

    if (isChapterIndexError) {
      toast({
        title: getErrorMessage(chapterIndexError),
      });
    }
  }, [isSuccess, isChapterIndexError, chapterIndexError]);

  function handleChapterIndexChange() {
    const result = chs.map((ch) => ({
      id: ch.id,
      sn: ch.sn,
    }));

    chapterIndexMutation(result);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between border-t border-border pb-2 pt-4 first:mt-0 sm:px-4">
        <h4 className="scroll-m-20 text-2xl font-bold tracking-tight">
          Chapters:
        </h4>
        {userId === storyDetails.author.id && (
          <>
            <Button
              type="button"
              onClick={async () => {
                const res = await mutateAsync({
                  story_id: storyDetails.id,
                });

                if (res) {
                  router.push(`/write/s/${res}`);
                }
              }}
              size="sm"
              variant="default"
            >
              {status === "pending" ? (
                <Spinner className="size-4 stroke-2 text-white" />
              ) : (
                <Edit01Icon className="size-4 stroke-2" />
              )}
              Publish New Chapter
            </Button>
          </>
        )}
      </div>
      {/* Draggable Component */}
      {userId === storyDetails.author.id ? (
        <div>
          {chs.length ? (
            <>
              <div>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                >
                  <SortableContext
                    items={chs}
                    strategy={verticalListSortingStrategy}
                  >
                    {chs.map((item) => (
                      <DragItem key={item.id} item={item} />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={!hasDraged || chapterIndexLoading === "pending"}
                  onClick={handleChapterIndexChange}
                >
                  {chapterIndexLoading === "pending" && (
                    <Spinner className="size-4 stroke-2 text-white" />
                  )}
                  Save Changes
                </Button>
              </div>
            </>
          ) : (
            <div className="py-12">
              <p className="text-center text-lg text-foreground">
                No chapters yet! <br />
                Start Writing and Publish your first chapter now.
              </p>
            </div>
          )}
        </div>
      ) : (
        // Non Draggable chapters component for non-authors
        <div>
          {chapters.length ? (
            chapters.map((ch) => (
              <Link key={ch.id} href={`/chapter/${ch.slug}`} className="w-full">
                <div className="flex items-center justify-between rounded-md px-4 py-2 hover:bg-rose-200/60">
                  <p className="line-clamp-1 text-lg font-semibold text-slate-700">
                    {ch.title}
                  </p>
                  <div className="flex items-center gap-2">
                    {ch.isPremium && (
                      <span>
                        <SquareLock02Icon size={16} />
                      </span>
                    )}
                    {!ch.published && (
                      <Badge className="bg-rose-500 text-xs font-bold text-white">
                        Draft
                      </Badge>
                    )}
                    <p className="xs:text-md whitespace-nowrap text-sm font-semibold text-slate-500">
                      {formatDate(ch.createdAt)}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="py-12">
              <p className="text-center text-lg text-foreground">
                No chapters yet! <br />
                Start Writing and Publish your first chapter now.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chapters;
