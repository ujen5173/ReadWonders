"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "~/components/ui/use-toast";
import { getErrorMessage } from "~/lib/handle-errors";
import { api } from "~/trpc/react";
import { CoinButton } from "./coin-button";

const UnlockSection = ({
  chapterId,
  price,
  totalChapterPrice,
}: {
  chapterId: string;
  totalChapterPrice: number;
  price: number;
}) => {
  const router = useRouter();
  const {
    mutateAsync: unlockEntireStory,
    status: loading,
    error,
    isError,
  } = api.chapter.unlockChapter.useMutation();

  useEffect(() => {
    if (isError) {
      toast({
        title: getErrorMessage(error),
      });
    }
  }, [isError]);

  const unlock = async () => {
    await unlockEntireStory({
      id: chapterId,
      unlockType: "single",
    });

    router.refresh();
    window?.scrollTo(0, 0);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <CoinButton
        loading={loading === "pending"}
        disabled={loading === "pending"}
        onClick={unlock}
        coins={totalChapterPrice}
        variant="default"
      >
        Unlock Entire Story
      </CoinButton>
      <CoinButton
        onClick={unlock}
        coins={price}
        loading={loading === "pending"}
        disabled={loading === "pending"}
        variant="secondary"
      >
        Unlock this part
      </CoinButton>
    </div>
  );
};

export default UnlockSection;
