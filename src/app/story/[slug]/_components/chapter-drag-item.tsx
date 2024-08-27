"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { DragDropVerticalIcon, SquareLock02Icon } from "hugeicons-react";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { formatDate } from "~/lib/helpers";
import { cn } from "~/lib/utils";

const DragItem = ({
  item,
}: {
  item: {
    id: string;
    title: string | null;
    slug: string | null;
    sn: number;
    isPremium: boolean;
    published: boolean;
    createdAt: Date;
  };
}) => {
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
      className={cn(
        "flex items-center justify-between rounded-md px-4 py-2 hover:bg-rose-200/60",
      )}
    >
      <div className="flex items-center gap-2">
        <div
          {...attributes}
          {...listeners}
          className={cn(isCursorGrabbing ? "cursor-grabbing" : "cursor-grab")}
        >
          <DragDropVerticalIcon size={22} color="#475569" strokeWidth={3} />
        </div>
        <Link href={`/chapter/${item.slug}`}>
          <p className="line-clamp-1 text-lg font-semibold text-slate-700">
            {item.title}
          </p>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        {item.isPremium && (
          <span>
            <SquareLock02Icon size={16} />
          </span>
        )}
        {!item.published && (
          <Badge className="bg-rose-500 text-xs font-bold text-white">
            Draft
          </Badge>
        )}
        <p className="xs:text-md whitespace-nowrap text-sm font-semibold text-slate-500">
          {formatDate(item.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default DragItem;
