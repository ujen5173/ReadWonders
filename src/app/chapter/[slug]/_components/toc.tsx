"use client";

import { SquareLock02Icon } from "hugeicons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
} from "~/components/ui/select";

const Toc = ({
  details,
}: {
  details: {
    story: {
      slug: string;
      thumbnail: string;
      title: string;
      author: {
        username: string;
      };
      chapters: {
        slug: string | null;
        title: string | null;
        isPremium: boolean;
      }[];
    };
  };
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Select open={open} onOpenChange={(e) => setOpen(e)}>
      <SelectTrigger className="h-auto w-full bg-white p-1 focus:outline-none focus:ring-0 focus:ring-offset-0 md:max-w-[450px]">
        <div className="flex items-center gap-2">
          <Image
            src={details.story.thumbnail}
            alt={details.story.title}
            width={32}
            height={32}
            className="w-9 rounded-sm object-fill"
          />
          <div>
            <p className="text-left text-base font-semibold">
              {details.story.title}
            </p>
            <p className="text-left text-sm text-gray-700">
              By {details.story.author.username}
            </p>
          </div>
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectGroup>
          <div className="border-b border-border px-4 py-2">
            <h1
              key={details.story.slug}
              onClick={() => {
                window.location.href = `/story/${details.story.slug}`;
              }}
              className="line-clamp-1 cursor-pointer text-center text-base font-medium hover:underline"
            >
              {details.story.title}
            </h1>

            <SelectLabel className="px-4 text-center text-slate-500">
              Table of Contents
            </SelectLabel>
          </div>
          <div className="py-2">
            {details.story.chapters.map((chapter) => (
              <Link
                href={`/chapter/${chapter.slug}`}
                key={chapter.slug}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between"
              >
                <p className="focus:text-text-light relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-4 pr-2 text-sm outline-none hover:bg-slate-200 focus:bg-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                  {chapter.title}
                </p>
                {chapter.isPremium && (
                  <span>
                    <SquareLock02Icon size={16} />
                  </span>
                )}
              </Link>
            ))}
          </div>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default Toc;
