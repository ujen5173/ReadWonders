import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import { cardHeight, cardWidth } from "~/server/constants";
import { type TCard } from "~/types";

const Card: FC<{ details: TCard }> = ({ details }) => {
  return (
    <Link
      href={"/book/" + details.slug}
      passHref
      className="mx-auto max-w-[270px] flex-1"
    >
      <Image
        className="mb-2 min-h-96 w-auto rounded-lg border border-border object-cover"
        src={details.thumbnail}
        width={cardWidth}
        height={cardHeight}
        alt={details.thumbnail}
      />
      <div>
        <h1 className="text-md font-bold text-slate-800">{details.title}</h1>
        <p className="text-sm font-medium text-slate-600">
          {details.author.name}
        </p>
      </div>
    </Link>
  );
};

export default Card;
