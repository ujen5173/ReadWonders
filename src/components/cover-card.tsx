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
import { useContext, type FC } from "react";
import { Context } from "~/app/_components/RootContext";
import ReadingListModel from "~/app/_components/reading-list-modal";
import { suezOne } from "~/config/font";
import { cardHeight, cardWidth } from "~/server/constants";
import { type TCard } from "~/types";
import { cn } from "~/utils/cn";
import { formatNumber } from "~/utils/helpers";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

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
  const { removeFromList, setActiveBook } = useContext(Context);

  return (
    <div
      onClick={() => setActiveBook(details)}
      className="cover-card group relative"
    >
      <Link href={"/story/[slug]"} as={`/story/${details.slug}`} legacyBehavior>
        <a className="relative block">
          {details.isMature && (
            <div className="absolute right-2 top-2 z-50">
              <Badge className={cn(`bg-primary text-xs`, suezOne.className)}>
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
            <h1 className="line-clamp-1 text-base font-medium text-slate-800 xxs:text-lg">
              {details.title}
            </h1>

            <p className="line-clamp-1 text-base text-gray-600">
              {details.author.name}
            </p>
          </div>
        </a>
      </Link>

      <div className="absolute inset-0 hidden flex-col sm:flex">
        <div className="mb-2 flex flex-1 flex-col justify-between rounded-md border border-border/70 bg-white p-4 opacity-0 transition group-hover:opacity-100">
          <div className="h-6">
            {details.categoryName && (
              <Link
                href={`/genre/${details.categoryName.toLowerCase()}`}
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
            {!details.readingList ? (
              details.id && <ReadingListModel bookId={details.id} />
            ) : (
              <Button
                variant={"secondary"}
                onClick={() =>
                  readingLisRemove !== undefined
                    ? void readingLisRemove(details.id)
                    : void removeFromList!(details.id)
                }
                loading={removing}
                className="w-full gap-2"
              >
                {!removing && (
                  <MinusSignSquareIcon size={16} className="stroke-2" />
                )}
                <span>Remove from List</span>
              </Button>
            )}
          </div>
        </div>

        <div className="invisible w-full">
          <h1 className="line-clamp-1 text-base font-medium text-slate-800 xxs:text-lg">
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
