import {
  BookOpen01Icon,
  EyeIcon,
  LeftToRightListNumberIcon,
  StarIcon,
} from "hugeicons-react";
import Image from "next/image";
import { merriweather } from "~/config/font";
import { type TCard } from "~/types";
import { formatNumber, formatReadingTime } from "~/utils/helpers";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const Card = ({ details }: { details: TCard }) => {
  return (
    <div
      className={`flex gap-4 rounded-md border border-border bg-white p-2 ${merriweather.className}`}
    >
      <div className="h-full w-48 overflow-hidden rounded-md">
        <Image
          src={details.thumbnail}
          alt={details.title}
          width={130}
          className="h-full w-full rounded-md object-cover"
          height={100}
        />
      </div>

      <div className="relative flex-1 py-2">
        <h1 className="mb-4 text-xl font-bold text-foreground">
          {details.title}
        </h1>

        <div className="mb-4 flex items-center gap-2">
          <Badge>Mature</Badge>
          <Badge variant="green">On Going</Badge>
        </div>

        <div className="mb-2 flex items-center gap-2">
          <div className="flex flex-col items-center px-2">
            <div className="flex gap-2">
              <EyeIcon size={16} className="mt-1" />
              <p>Reads</p>
            </div>
            <p className="font-bold">{formatNumber(details.reads)}</p>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="flex flex-col items-center px-2">
            <div className="flex gap-2">
              <StarIcon size={16} className="mt-1" />
              <p>Likes</p>
            </div>
            <p className="font-bold">{formatNumber(details.reads / 4)}</p>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="flex flex-col items-center px-2">
            <div className="flex gap-2">
              <LeftToRightListNumberIcon className="mt-1" size={16} />
              <p>Chapters</p>
            </div>
            <p className="font-bold">{12}</p>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="flex flex-col items-center px-2">
            <div className="flex gap-2">
              <BookOpen01Icon className="mt-1" size={16} />
              <p>Time</p>
            </div>
            <p className="font-bold">{formatReadingTime(details.reads)}</p>
          </div>
        </div>

        <p className="mb-4 text-foreground">
          {details.description.length > 150
            ? `${details.description.substr(0, 150)}...`
            : details.description}
        </p>

        <div className="flex items-center gap-2">
          <Button>Start Reading</Button>
          <Button variant="secondary">Add to Reading List</Button>
        </div>
      </div>
    </div>
  );
};

export default Card;
