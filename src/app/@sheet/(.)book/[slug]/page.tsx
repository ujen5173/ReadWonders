"use client";

import { BookOpen } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
} from "~/components/ui/sheet";
import { cardHeight, cardWidth } from "~/server/constants";
import { api } from "~/trpc/react";

const Book = ({
  params,
}: {
  params: {
    slug: string;
  };
}) => {
  const router = useRouter();
  const { slug } = params;
  const { data, isLoading } = api.book.getSingle.useQuery(
    { slug },
    {
      refetchOnWindowFocus: false,
    },
  );

  if (isLoading && !data) return;

  return (
    <Sheet
      defaultOpen
      onOpenChange={(isOpen) => {
        if (!isOpen) router.back();
      }}
    >
      <SheetContent>
        {/* isLoading && !data -> loading skeleton here... */}
        <SheetHeader>
          <div className="flex gap-2">
            <div className="w-4/12">
              <Image
                src={data?.thumbnail as string}
                width={cardWidth}
                height={cardHeight}
                className="w-full rounded-md border border-border object-cover"
                alt={data?.title as string}
              />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{data?.title}</h1>
              <p className="text-gray-500">{data?.authorId}</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <BookOpen size={18} className="text-text-secondary" />
                  <span className="text-text-secondary">{data?.reads}</span>
                </div>
              </div>
            </div>
            <div>
              {data?.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-200 px-2 py-1 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </SheetHeader>
        <SheetDescription>{data?.description}</SheetDescription>
      </SheetContent>
    </Sheet>
  );
};

export default Book;
