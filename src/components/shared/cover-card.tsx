"use client";

import {
  ArrowRight02Icon,
  FavouriteIcon,
  LeftToRightListNumberIcon,
  LinkSquare02Icon,
  MinusSignSquareIcon,
  ViewIcon,
} from "hugeicons-react";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState, type FC } from "react";
import slugify from "slugify";
import { merriweather } from "~/config/font";
import { formatNumber } from "~/lib/helpers";
import { cn } from "~/lib/utils";
import { cardHeight, cardWidth, slugy } from "~/server/constants";
import { type TCard } from "~/types";
import { Context } from "../context/root-context";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { toast } from "../ui/use-toast";
import { Spinner } from "./Loading";
import ReadingListModel from "./reading-list-modal";

const CoverCard: FC<{
  removeFromList?: (id: string) => Promise<void>;
  showNormalSheet?: boolean;
  removing?: boolean;
  details: TCard & {
    readingList: boolean;
  };
}> = ({
  removeFromList: readingLisRemove,
  removing,
  showNormalSheet = false,
  details,
}) => {
  const [removingTail, setRemovingTail] = useState(false);
  const [tailRemovedFromList, setTailRemovedFromList] = useState(false);
  const { removeFromList, setActiveBook } = useContext(Context);

  return (
    <div
      onClick={() => setActiveBook(details)}
      className="cover-card group relative"
    >
      <Link href="/story/[slug]" as={`/story/${details.slug}`} legacyBehavior>
        <a className="relative block">
          {details.isMature && (
            <div className="absolute right-2 top-2 z-50">
              <Badge
                className={cn(`bg-primary text-xs`, merriweather.className)}
              >
                18+
              </Badge>
            </div>
          )}

          <Image
            className="cover-card-img mb-2 rounded-lg object-fill"
            src={details.thumbnail}
            alt={details.thumbnail}
            width={cardWidth}
            height={cardHeight}
            style={{
              aspectRatio: "1/1.5",
            }}
          />

          <div className="w-full">
            <h1 className="xxs:text-lg line-clamp-1 text-base font-medium text-slate-800">
              {details.title}
            </h1>

            <p className="line-clamp-1 text-base text-gray-600">
              {details.author.name}
            </p>
          </div>
        </a>
      </Link>

      <div className="absolute inset-0 hidden flex-col sm:flex">
        <div className="mb-2 flex flex-1 flex-col justify-between rounded-md border border-border/70 bg-white p-4 opacity-0 transition duration-300 hover:shadow-md group-hover:opacity-100">
          <div className="h-6">
            {details.categoryName && (
              <Link
                href={`/genre/${slugify(details.categoryName, slugy)}`}
                passHref
              >
                <Badge className="border border-border" variant="secondary">
                  {details.categoryName}
                </Badge>
              </Link>
            )}
          </div>
          <div className="flex items-center justify-center py-4">
            {showNormalSheet ? (
              <div
                onClick={() => setActiveBook(details)}
                className="flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary/80 hover:underline"
              >
                <span>Full Story Infos</span>
                <ArrowRight02Icon size={16} />
              </div>
            ) : (
              <Link
                href={`/story/${details.slug}`}
                className="flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary/80 hover:underline"
              >
                <span>Full Story Infos</span>
                <ArrowRight02Icon size={16} />
              </Link>
            )}
          </div>

          <div className="flex items-center justify-between pb-4">
            <div className="flex flex-col items-center px-2">
              <div className="flex gap-2">
                <ViewIcon size={16} className="mt-1 stroke-2" />
              </div>
              <p className="text-sm font-semibold">
                {formatNumber(details.reads)}
              </p>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="flex flex-col items-center px-2">
              <div className="flex gap-2">
                <FavouriteIcon size={16} className="mt-1 stroke-2" />
              </div>
              <p className="text-sm font-semibold">
                {formatNumber(details.love)}
              </p>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="flex flex-col items-center px-2">
              <div className="flex gap-2">
                <LeftToRightListNumberIcon
                  size={16}
                  className="mt-1 stroke-2"
                />
              </div>
              <p className="text-sm font-semibold">
                {(details?.chapters ?? []).length}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Link target="_blank" href={`/story/${details.slug}`}>
              <Button className="w-full gap-2">
                <LinkSquare02Icon size={16} className="stroke-2" />
                <span>View Details</span>
              </Button>
            </Link>
            {tailRemovedFromList || !details.readingList ? (
              details.id && <ReadingListModel bookId={details.id} />
            ) : (
              <Button
                variant="secondary"
                onClick={async () => {
                  if (readingLisRemove !== undefined) {
                    await readingLisRemove(details.id);
                  } else {
                    setRemovingTail(true);
                    const res = await removeFromList(details.id);

                    setRemovingTail(false);

                    if (res) {
                      toast({
                        title: "Tail removed from reading list",
                      });
                      setTailRemovedFromList(true);
                    } else {
                      toast({
                        title: "Failed to remove tail from reading list",
                      });
                      setTailRemovedFromList(false);
                    }
                  }
                }}
                className="w-full gap-2"
              >
                {!(removingTail || removing) ? (
                  <MinusSignSquareIcon size={16} className="stroke-2" />
                ) : (
                  <Spinner className="size-4 text-slate-600" />
                )}
                <span>Remove from List</span>
              </Button>
            )}
          </div>
        </div>

        <div className="invisible w-full">
          <h1 className="xxs:text-lg line-clamp-1 text-base font-medium text-slate-800">
            {details.title}
          </h1>

          <p className="line-clamp-1 text-base text-gray-600">
            {details.author.name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoverCard;
