"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";

const SupriseButton = () => {
  const [fetch, setFetch] = useState(false);
  const { refetch } = api.story.randomTale.useQuery(undefined, {
    refetchOnWindowFocus: false,
    enabled: fetch,
  });

  return (
    <Button
      onClick={async () => {
        setFetch(true);
        const res = await refetch();

        if (res.data && res.data.length > 0) {
          window.location.href = `/story/${res.data[0]!.slug}`;
        }
      }}
    >
      Suprise me with Random tale
    </Button>
  );
};

export default SupriseButton;
