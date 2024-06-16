"use client";

import { Eye, LayoutList, MoveRight, PlusSquare, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useContext, type FC } from "react";
import { Context } from "~/app/_components/RootContext";
import { cardHeight, cardWidth } from "~/server/constants";
import { type TCard } from "~/types";
import { formatNumber } from "~/utils/helpers";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const CoverCard: FC<{ details: TCard }> = ({ details }) => {
  const { setActiveBook } = useContext(Context);

  return (
    <div
      style={{
        width: cardWidth + "px",
      }}
      className="group relative"
    >
      <Link
        onClick={() => setActiveBook(details)}
        href={"/story/" + details.slug}
        passHref
      >
        <div className="relative">
          <Image
            className="mb-2 rounded-lg border border-border object-cover"
            src={details.thumbnail}
            alt={details.thumbnail}
            width={cardWidth}
            height={cardHeight}
            style={{
              width: cardWidth + "px",
              height: cardHeight + "px",
            }}
          />
          <div className="absolute inset-0 flex flex-col justify-between rounded-md border border-border/70 bg-white p-4 opacity-0 transition group-hover:opacity-100">
            <div className="flex items-center justify-between">
              <div className="mb-2 w-full">
                <Badge className="border border-border" variant="secondary">
                  {details.category}
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-center py-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary/80 hover:underline"
              >
                <span>Full Story Infos</span>
                <MoveRight size={16} />
              </Link>
            </div>
            <div className="flex items-center justify-between pb-4">
              <div className="flex flex-col items-center px-2">
                <div className="flex gap-2">
                  <Eye size={16} className="mt-1" />
                </div>
                <p className="text-sm font-bold">
                  {formatNumber(details.reads)}
                </p>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div className="flex flex-col items-center px-2">
                <div className="flex gap-2">
                  <Star size={16} className="mt-1" />
                </div>
                <p className="text-sm font-bold">
                  {formatNumber(details.reads / 4)}
                </p>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div className="flex flex-col items-center px-2">
                <div className="flex gap-2">
                  <LayoutList className="mt-1" size={16} />
                </div>
                <p className="text-sm font-bold">{12}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Button className="w-full gap-2">Start Reading</Button>
              <Button variant="secondary" className="w-full gap-2">
                <PlusSquare size={16} />
                <span>Reading List</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full">
          <h1 className="text-md line-clamp-1 font-bold text-slate-800">
            {details.title}
          </h1>
        </div>
      </Link>
    </div>
  );
};

export default CoverCard;
