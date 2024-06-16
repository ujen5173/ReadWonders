"use client";

import CharacterCount from "@tiptap/extension-character-count";
import TImage from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import {
  BookOpen,
  Eye,
  Facebook,
  Instagram,
  LayoutList,
  Link2,
  Plus,
  Star,
  Twitter,
} from "lucide-react";
import Image from "next/image";
import { type JSONContent } from "novel";
import CoverCard from "~/components/cover-card";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { contentFont, fontInter } from "~/config/font";
import { api } from "~/trpc/react";
import { formatNumber, formatReadingTime } from "~/utils/helpers";

const Chapter = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const {
    data: chapterDetails,
    isLoading,
    error,
  } = api.chapter.getSingeChapter.useQuery(
    { slug },
    {
      refetchOnWindowFocus: false,
    },
  );

  const { data: recommendations } = api.story.getAll.useQuery(
    {},
    {
      refetchOnWindowFocus: false,
    },
  );

  console.log({ chapterDetails, isLoading, error });

  if (!chapterDetails) return null;

  return (
    <section className="w-full">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="border-b border-border pb-6 pt-12">
          {chapterDetails.thumbnail && (
            <Image
              src={chapterDetails.thumbnail!}
              alt={chapterDetails.title!}
              width={1200}
              height={480}
              className="mb-8 h-72 w-full rounded-lg object-cover"
            />
          )}

          <h1
            className={`mb-8 scroll-m-20 text-center text-3xl font-extrabold tracking-tight lg:text-5xl ${fontInter.className}`}
          >
            {chapterDetails.title}
          </h1>

          <div className="mb-2 flex items-center justify-center gap-2">
            <div className="px-2">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <Eye size={16} />
                  <p>Reads</p>
                </div>
                <p className="font-bold">
                  {formatNumber(chapterDetails.reads)}
                </p>
              </div>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="px-2">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <Star size={16} />
                  <p>Likes</p>
                </div>
                <p className="font-bold">
                  {formatNumber(chapterDetails.reads / 4)}
                </p>
              </div>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="px-2">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <LayoutList size={16} />
                  <p>Chapters</p>
                </div>
                <p className="font-bold">{12}</p>
              </div>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="px-2">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <BookOpen size={16} />
                  <p>Time</p>
                </div>
                <p className="font-bold">
                  {formatReadingTime(chapterDetails.reads / 66)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto flex max-w-screen-lg flex-col items-center justify-stretch gap-8 py-8">
          <div
            className={`${contentFont.className} w-full max-w-none space-y-4 whitespace-pre-line`}
            dangerouslySetInnerHTML={{
              __html: generateHTML(chapterDetails.content as JSONContent, [
                Placeholder,
                Youtube,
                Link,
                Underline,
                TImage,
                CharacterCount,
                TextStyle,
                StarterKit,
              ]),
            }}
          ></div>
          <Button className="mx-auto w-96">Continue to next Chapter</Button>
          <div className="flex w-full items-center justify-between border-b border-border pb-6">
            <div className="flex items-center">
              <Button variant="ghost-link">
                <Plus size={16} />
                <span>Add to favorites</span>
              </Button>
              <Button variant="ghost-link">
                <Plus size={16} />
                <span>Up Vote</span>
              </Button>
            </div>
            <div className="flex items-center">
              <Button variant="ghost-link">
                <Twitter size={16} />
              </Button>
              <Button variant="ghost-link">
                <Instagram size={16} />
              </Button>
              <Button variant="ghost-link">
                <Facebook size={16} />
              </Button>
              <Button variant="ghost-link">
                <Link2 size={16} />
              </Button>
            </div>
          </div>
          <div className="w-full">
            <h1 className="text-2xl font-semibold text-foreground">
              <h1>Recommendations</h1>
            </h1>
            <div className="flex gap-4">
              {recommendations?.map((recommendation) => (
                <CoverCard key={recommendation.id} details={recommendation} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chapter;
