"use client";

import { Edit01Icon, SquareLock02Icon } from "hugeicons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import { getErrorMessage } from "~/utils/handle-errors";
import { formatDate } from "~/utils/helpers";

const Chapters = ({
  userId,
  storyDetails,
}: {
  userId: string | undefined;
  storyDetails: {
    id: string;
    slug: string;
    author: { id: string };
    chapters: {
      id: string;
      title: string | null;
      slug: string | null;
      isPremium: boolean;
      published: boolean;
      createdAt: Date;
    }[];
  };
}) => {
  const router = useRouter();
  const { mutateAsync, isLoading, isError, error } =
    api.chapter.new.useMutation();

  useEffect(() => {
    if (isError) {
      toast({
        title: getErrorMessage(error),
      });
    }
  }, [isError, error]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between border-t border-border pt-4">
        <h4 className="scroll-m-20 px-4 pb-2 text-2xl font-bold tracking-tight first:mt-0">
          Chapters:
        </h4>
        {userId === storyDetails.author.id && (
          <Button
            type={"button"}
            loading={isLoading}
            onClick={async () => {
              const res = await mutateAsync({
                story_id: storyDetails.id,
              });

              if (res) {
                router.push(`/write/s/${res}`);
              }
            }}
            size="sm"
            variant="default"
          >
            <Edit01Icon className="size-4 stroke-2" />
            Publish New Chapter
          </Button>
        )}
      </div>

      {(storyDetails.chapters ?? []).length > 0 ? (
        storyDetails.chapters.map((ch) =>
          userId !== storyDetails.author.id && !ch.published ? null : (
            <Link
              key={ch.id}
              target="_blank"
              href={`/chapter/${ch.slug}`}
              className="w-full"
            >
              <div className="flex items-center justify-between rounded-md px-4 py-2 hover:bg-rose-200/60">
                <p className="line-clamp-1 text-lg font-semibold text-slate-700">
                  {ch.title}
                </p>
                <div className="flex items-center gap-2">
                  {ch.isPremium && (
                    <span>
                      <SquareLock02Icon size={16} />
                    </span>
                  )}
                  {!ch.published && (
                    <Badge className="bg-rose-500 text-xs font-bold  text-white">
                      Draft
                    </Badge>
                  )}
                  <p className="xs:text-md whitespace-nowrap text-sm font-semibold text-slate-500">
                    {formatDate(ch.createdAt)}
                  </p>
                </div>
              </div>
            </Link>
          ),
        )
      ) : (
        <div className="py-12">
          <p className="text-center text-lg text-foreground">
            No chapters yet! <br />
            <span className="cursor-pointer text-primary underline">
              Follow this book
            </span>{" "}
            for updates on new chapters.
          </p>
        </div>
      )}
    </div>
  );
};

export default Chapters;
