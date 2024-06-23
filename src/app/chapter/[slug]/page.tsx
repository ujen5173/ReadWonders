import CharacterCount from "@tiptap/extension-character-count";
import TImage from "@tiptap/extension-image";
import TLink from "@tiptap/extension-link";
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
import Link from "next/link";
import { type JSONContent } from "novel";
import ReadingListModel from "~/app/_components/reading-list-modal";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { contentFont, merriweather } from "~/config/font";
import { api } from "~/trpc/server";
import { formatDate, formatNumber, formatReadingTime } from "~/utils/helpers";
import SimilarStories from "./_components/similar-stories";

const Chapter = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  const chapterDetails = await api.chapter.getSingeChapter.query({ slug });

  if (!chapterDetails) return null;

  return (
    <section className="w-full">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="flex items-center justify-between border-b border-border py-2">
          <Select>
            <SelectTrigger className="h-auto w-[450px] bg-white focus:outline-none focus:ring-0 focus:ring-offset-0">
              <div className="flex items-center gap-2">
                <Image
                  src={chapterDetails.story.thumbnail}
                  alt={chapterDetails.story.title}
                  width={32}
                  height={32}
                  className="w-8  rounded-sm object-fill"
                />
                <div>
                  <p className="text-left text-base font-semibold">
                    {chapterDetails.story.title}
                  </p>
                  <p className="text-left text-sm text-gray-700">
                    By {chapterDetails.story.author.username}
                  </p>
                </div>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                <div className="border-b border-border px-4 py-2">
                  <Link
                    href={`/story/${chapterDetails.story.slug}`}
                    key={chapterDetails.story.slug}
                  >
                    <h1 className="line-clamp-1 text-center text-base font-medium hover:underline">
                      {chapterDetails.story.title}
                    </h1>
                  </Link>

                  <SelectLabel className="px-4 text-center text-slate-500">
                    Table of Contents
                  </SelectLabel>
                </div>
                <div className="py-2">
                  {chapterDetails.story.chapters.map((chapter) => (
                    <Link href={`/chapter/${chapter.slug}`} key={chapter.slug}>
                      <div className="focus:text-text-light focus:bg-accent relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-4 pr-2 text-sm outline-none hover:bg-slate-200 data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        {chapter.title}
                      </div>
                    </Link>
                  ))}
                </div>
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <ReadingListModel bookId={chapterDetails.story!.id} />
            <Button>
              <Plus size={16} />
              <span>Follow</span>
            </Button>
          </div>
        </div>
        <div className="border-b border-border pb-6 pt-12">
          {chapterDetails.thumbnail && (
            <Image
              src={chapterDetails.thumbnail!}
              alt={chapterDetails.title!}
              width={1200}
              height={480}
              className="mb-8 h-96 w-full rounded-lg object-cover"
            />
          )}

          <h1
            className={`mb-8 scroll-m-20 text-center text-3xl font-extrabold tracking-tight lg:text-5xl ${merriweather.className}`}
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
                TLink,
                Underline,
                TImage,
                CharacterCount,
                TextStyle,
                StarterKit,
              ]),
            }}
          ></div>

          {chapterDetails.nextChapter ? (
            <Link href={`/chapter/${chapterDetails.nextChapter?.slug}`}>
              <Button className="mx-auto w-96">Continue to next Chapter</Button>
            </Link>
          ) : (
            <div className="py-8">
              <p className="my-2 text-center text-xl font-medium text-foreground">
                You have reached the end of this story
              </p>

              <p className="my-2 text-center text-base text-gray-500">
                Last Updated:{" "}
                <span className="font-medium">
                  {formatDate(chapterDetails.updatedAt)}
                </span>
              </p>
              <p className="my-2 text-center text-base text-gray-500">
                Follow the author to get notified when they publish a new story
              </p>
            </div>
          )}

          <div className="flex w-full items-center justify-between pb-6">
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
        </div>
      </div>

      <SimilarStories />
    </section>
  );
};

export default Chapter;
