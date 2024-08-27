import { MoreVerticalSquare01Icon } from "hugeicons-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import {
  bookHeight,
  bookWidth,
  cardHeight,
  cardWidth,
} from "~/server/constants";
import { type TReadingListCard } from "~/types";
import DeleteDialog from "../dialogs/delete-dialog";
import EditReadingList from "./edit-list";

const ReadingListCard = ({
  showActions,
  readingList,
  onEditConfirm,
  onDeleteConfirm,
}: {
  showActions: boolean;
  readingList: TReadingListCard;
  onEditConfirm: (
    id: string,
    title: string,
    description: string | null,
  ) => Promise<void>;
  onDeleteConfirm: (id: string) => Promise<void>;
}) => {
  return (
    <div
      key={readingList.id}
      className="overflow-hidden rounded-2xl border border-border bg-white shadow-md"
      style={{
        maxWidth: cardWidth * 2 + "px",
        width: "100%",
      }}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-4">
        <Link href={`/reading-list/${readingList.slug}`}>
          <h2 className="line-clamp-1 text-lg font-medium">
            {readingList.title}
          </h2>
        </Link>
        {showActions && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVerticalSquare01Icon size={18} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 overflow-hidden bg-white p-0">
              <EditReadingList
                title={readingList.title}
                details={{
                  title: readingList.title,
                  description: readingList.description,
                }}
                onConfirm={(title: string, description: string | null) =>
                  onEditConfirm(readingList.id, title, description)
                }
              />
              <Separator />
              <DeleteDialog
                title={`Delete '${readingList.title}' reading list`}
                description="This action cannot be undone. This will permanently delete the reading list."
                onConfirm={() => onDeleteConfirm(readingList.id)}
                variant="ghost"
                style="w-full outline-none focus-visible:ring-0 focus-visible:ring-offset-0 justify-start rounded-none transition hover:bg-primary hover:text-white"
              />
            </PopoverContent>
          </Popover>
        )}
      </div>

      <Link href={`/reading-list/${readingList.slug}`}>
        <div
          style={{
            maxHeight: cardHeight / 1.4 + 32 + 44 + "px",
            height: "20vh",
            minHeight: "260px",
            width: cardWidth * 2 + "px",
            maxWidth: "100%",
          }}
          className="relative flex w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-b-2xl border-t-2 border-slate-200 bg-slate-100 p-4"
        >
          {readingList.stories.length > 0 ? (
            readingList.stories.map((story, index) => {
              // Centering calculation for the cards
              const length = readingList.stories.length;
              const shiftX = 20 * length; // control horizontal shift
              const shiftY = 12; // control vertical shift
              const initialX = (-(length - 1) * shiftX) / 2; // Centering calculation for X
              const initialY = (-(length - 1) * shiftY) / 2; // Centering calculation for Y
              const transform = `translate(${initialX + index * shiftX}px, ${initialY + index * shiftY}px)`;

              return (
                <div
                  key={index}
                  className="absolute"
                  style={{
                    maxWidth: bookWidth + "px",
                    width: "33%",
                    maxHeight: bookHeight + "px",
                    minHeight: "180px",
                    height: "45%",
                    zIndex: length - index,
                    transform,
                  }}
                >
                  <Image
                    src={story.thumbnail}
                    className="relative inset-0 h-full w-full rounded-md border border-border object-fill shadow"
                    alt={"thumbnail"}
                    width={bookWidth}
                    height={bookHeight}
                    style={{
                      zIndex: readingList.stories.length - index,
                    }}
                  />
                  <div
                    className="absolute -bottom-[5px] -right-[5px] rounded border border-border bg-stone-100 shadow-lg"
                    style={{
                      zIndex: -index,
                      maxWidth: bookWidth + "px",
                      width: "100%",
                      maxHeight: bookHeight + "px",
                      height: "100%",
                    }}
                  ></div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-slate-600">
              <p>No stories added yet</p>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ReadingListCard;
