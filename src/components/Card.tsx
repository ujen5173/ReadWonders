import Image from "next/image";
import { type FC } from "react";
import { cardHeight, cardWidth } from "~/server/constants";

type CardDetails = {
  id: string;
  image: string;
  title: string;
  author: string;
};

const Card: FC<{ details: CardDetails }> = ({ details }) => {
  return (
    <div className="mx-auto max-w-[270px] flex-1">
      <Image
        className="mb-2 min-h-72 w-full rounded-lg border border-border object-cover"
        src={details.image}
        width={cardWidth}
        height={cardHeight}
        alt={details.image}
      />
      <div>
        <h1 className="mb-1 text-sm font-semibold text-slate-800">
          {details.title}
        </h1>
        <p className="text-text-light text-xs">{details.author}</p>
      </div>
    </div>
  );
};

export default Card;
