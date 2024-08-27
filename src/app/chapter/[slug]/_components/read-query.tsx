"use client";

import { memo, useRef } from "react";
import { api } from "~/trpc/react";

const ReadQuery = ({ id }: { id: string }) => {
  const { mutate } = api.chapter.read.useMutation({});

  const hasMutated = useRef(false);

  if (!hasMutated.current) {
    hasMutated.current = true;
    setTimeout(() => {
      mutate({
        id: id,
      });
    }, 5000);
  }

  return null;
};

export default memo(ReadQuery);
