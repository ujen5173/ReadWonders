"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CoinButton } from "~/components/ui/coin-button";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import { getErrorMessage } from "~/utils/handle-errors";

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
    isLoading: loading,
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
        loading={loading}
        disabled={loading}
        onClick={unlock}
        coins={totalChapterPrice}
        variant="default"
      >
        Unlock Entire Story
      </CoinButton>
      <CoinButton
        onClick={unlock}
        coins={price}
        loading={loading}
        disabled={loading}
        variant="secondary"
      >
        Unlock this part
      </CoinButton>
    </div>
  );
};

export default UnlockSection;
