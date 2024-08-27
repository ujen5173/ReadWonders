import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragDropVerticalIcon, LockIcon } from "hugeicons-react";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button, buttonVariants } from "~/components/ui/button";
import { formatDate } from "~/lib/helpers";
import { cn } from "~/lib/utils";
import { type ChapterCardWithPublish } from "~/types";

const EditChapterDragItem = ({ item }: { item: ChapterCardWithPublish }) => {
  const uniqueId = item.id;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: uniqueId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isCursorGrabbing = attributes["aria-pressed"];

  return (
    <div
      style={style}
      ref={setNodeRef}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-2">
        <div
          {...attributes}
          {...listeners}
          className={cn(isCursorGrabbing ? "cursor-grabbing" : "cursor-grab")}
        >
          <DragDropVerticalIcon size={22} color="#475569" strokeWidth={3} />
        </div>
        <Link href={`/itemapter/${item.slug}`}>
          <p className="line-clamp-1 text-lg font-semibold text-slate-700">
            {item.title}
          </p>
        </Link>
      </div>{" "}
      <div className="flex items-center gap-2">
        {item.isPremium && <LockIcon className="size-2" />}
        {!item.published && (
          <Badge className="text-xs font-semibold">Draft</Badge>
        )}
        <span className="text-sm">{formatDate(item.createdAt)}</span>
        <div className="flex items-center gap-2">
          <Link
            href={`/write/s/${item.slug}`}
            className={cn(
              buttonVariants({
                variant: "secondary",
                size: "sm",
              }),
            )}
          >
            Edit
          </Link>
          <Button
            variant="destructive"
            type="button"
            size="sm"
            onClick={() => {
              // Do nothing
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditChapterDragItem;
