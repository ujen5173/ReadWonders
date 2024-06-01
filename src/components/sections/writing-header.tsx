"use client";

import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";

const WritingHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams().get("title")?.trim() ?? "";

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
            <p className="text-xl font-bold text-text-secondary">
              {searchParams.length > 0
                ? `Writing: ${searchParams}`
                : "Write a new book"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pathname.includes("story") ? (
            <>
              <Button size="sm" variant="outline">
                Preview
              </Button>
              <Button size="sm">Publish</Button>
            </>
          ) : (
            <Button size="sm">Next</Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default WritingHeader;
