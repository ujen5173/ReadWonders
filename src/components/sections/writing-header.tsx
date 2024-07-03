"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "../Logo";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const WritingHeader = ({
  onSubmit,
  loading,
}: {
  onSubmit: (value: "PUBLISH" | "NEXT") => void;
  loading: "PUBLISH" | "NEXT" | null;
}) => {
  const router = useRouter();

  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-[1140px] items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              void router.back();
            }}
            size="icon"
            variant="ghost-link"
            className="p-1"
          >
            <ChevronLeft size={24} />
          </Button>
          <div>
            <p className="text-xl font-bold text-text-secondary">New Chapter</p>
          </div>
        </div>

        <div>
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip delayDuration={20}>
              <TooltipTrigger asChild>
                <Button
                  loading={loading === "NEXT"}
                  disabled={!!loading}
                  onClick={() => onSubmit("NEXT")}
                  size="sm"
                  variant={"secondary"}
                >
                  Next
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save as draft and proceed to next chapter</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            loading={loading === "PUBLISH"}
            disabled={!!loading}
            onClick={() => onSubmit("PUBLISH")}
            size="sm"
          >
            Publish
          </Button>
        </div>
      </div>
    </header>
  );
};

export default WritingHeader;
