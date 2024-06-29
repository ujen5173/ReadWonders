"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

const StartReading = ({ hasChapter }: { hasChapter: string | null }) => {
  const router = useRouter();

  return (
    <Button
      disabled={(() => {
        if (hasChapter) {
          return false;
        }

        return true;
      })()}
      onClick={() => {
        if (hasChapter) {
          router.push(hasChapter);
        }
      }}
      className="w-full"
      variant="default"
    >
      Start Reading
    </Button>
  );
};

export default StartReading;
