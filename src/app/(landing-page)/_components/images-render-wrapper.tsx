"use client";

import { useState } from "react";
import { chunkIntoN } from "~/lib/helpers";
import { heroImagesFallback } from "~/lib/hero-images/data";
import ImagesWrapper from "./image-wrapper";

const ImagesRenderWrapper = ({
  data,
}: {
  data: {
    title: string;
    slug: string;
    thumbnail: string;
  }[];
}) => {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  return (
    <>
      {chunkIntoN(data ?? heroImagesFallback, 4).map((chunk, index) => {
        return (
          <ImagesWrapper
            hoveredImage={hoveredImage}
            setHoveredImage={setHoveredImage}
            key={index}
            chunk={chunk}
            index={index}
          />
        );
      })}
    </>
  );
};

export default ImagesRenderWrapper;
