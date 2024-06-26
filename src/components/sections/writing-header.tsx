"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Logo from "../Logo";
import { Button } from "../ui/button";

const WritingHeader = ({
  onSubmit,
  uploadingChapter,
  nextChapterLoading,
}: {
  onSubmit: (value: "PUBLISH" | "NEXT") => void;
  uploadingChapter: boolean;
  nextChapterLoading: boolean;
}) => {
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
                ? searchParams
                : `${pathname.includes("/write/s") ? "Untitled Chapter" : "Untitled Story"}`}
            </p>
          </div>
        </div>

        <div>
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            Preview
          </Button>
          <Button
            loading={uploadingChapter}
            disabled={uploadingChapter || nextChapterLoading}
            onClick={() => onSubmit("NEXT")}
            size="sm"
          >
            Next
          </Button>
          <Button
            loading={nextChapterLoading}
            disabled={uploadingChapter || nextChapterLoading}
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
