import CharacterCount from "@tiptap/extension-character-count";
import TImage from "@tiptap/extension-image";
import TLink from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";

import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { type JSONContent } from "novel";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

import TextAlign from "@tiptap/extension-text-align";
import {
  BookOpen01Icon,
  LeftToRightListNumberIcon,
  SquareLock02Icon,
  StarIcon,
  ViewIcon,
} from "hugeicons-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import NotFound from "~/app/not-found";
import { LoadingColumn } from "~/components/Cardloading";
import { ShareButton } from "~/components/Share";
import StoriesArea from "~/components/sections/stories-area";
import { Separator } from "~/components/ui/separator";
import { contentFont } from "~/config/font";
import { constructMetadata, getBaseUrl, siteConfig } from "~/config/site";
import { fetchSimilar } from "~/storiesActions";
import { api } from "~/trpc/server";
import { formatDate, formatNumber, formatReadingTime } from "~/utils/helpers";
import ChapterHeader from "./_components/chapter-header";
import ReadQuery from "./_components/read-query";
import UnlockSection from "./_components/unlock-section";
import UpVote from "./_components/up-vote";

interface Props {
  params: {
    slug: string;
  };
}
export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  try {
    const { data: chapter } = await api.chapter.getSingleChapter.query({
      slug: params.slug,
    });

    if (!chapter) {
      return constructMetadata();
    }

    return constructMetadata({
      title: `${chapter.title} - ${siteConfig.name}`,
      image: chapter.thumbnail
        ? chapter.thumbnail
        : `${getBaseUrl()}/og-image.jpg`,
      publishedTime: chapter.createdAt.toString(),
      url: `${getBaseUrl()}/chapter/${params.slug}`,
    });
  } catch (err) {
    return constructMetadata();
  }
}

const Chapter = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  const { data: chapterDetails, hasPaid } =
    await api.chapter.getSingleChapter.query({ slug });

  const user = await api.auth.authInfo.query();

  if (!chapterDetails) return notFound();

  if (chapterDetails.isPremium && !hasPaid) {
    return (
      <section className="w-full">
        <ChapterHeader
          chapterDetails={{
            id: chapterDetails.id,
            published: chapterDetails.published,
            story: {
              id: chapterDetails.story.id,
              thumbnail: chapterDetails.story.thumbnail,
              title: chapterDetails.story.title,
              slug: chapterDetails.story.slug,
              author: {
                id: chapterDetails.story.author.id,
                username: chapterDetails.story.author.username,
                followers: chapterDetails.story.author.followers,
              },
              chapters: chapterDetails.story.chapters,
              published: chapterDetails.published,
            },
          }}
          user={user}
        />
        <div className="mx-auto max-w-screen-xl px-4">
          {/* <div className="flex flex-col items-center justify-between gap-4 border-b border-border py-2 pb-6 sm:flex-row sm:gap-6 sm:pb-2">
            <div className="flex-1">
              <Select>
                <SelectTrigger className="h-auto max-w-[450px] bg-white p-2 focus:outline-none focus:ring-0 focus:ring-offset-0">
                  <div className="flex items-center gap-2">
                    <Image
                      src={chapterDetails.story.thumbnail}
                      alt={chapterDetails.story.title}
                      width={32}
                      height={32}
                      className="w-8 rounded-sm object-fill"
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
                        <Link
                          href={`/chapter/${chapter.slug}`}
                          key={chapter.slug}
                        >
                          <div className="focus:text-text-light focus:bg-accent relative flex w-full cursor-pointer select-none items-center justify-between rounded-sm py-1.5 pl-4 pr-2 text-sm outline-none hover:bg-slate-200 data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                            <span>{chapter.title}</span>
                            {chapter.isPremium && (
                              <SquareLock02Icon
                                size={16}
                                className="text-accent"
                              />
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid w-full grid-cols-2 gap-2 xs:w-auto">
              {user?.id === chapterDetails.story.author.id ? (
                <>
                  <Visibility
                    id={chapterDetails.id}
                    published={chapterDetails.published}
                  />
                  <Link href={`/edit/${chapterDetails.story.slug}/chapter`}>
                    <Button variant={"default"}>Edit Story</Button>
                  </Link>
                </>
              ) : (
                <>
                  <ReadingListModel bookId={chapterDetails.story!.id} />
                  <FollowButton
                    id={chapterDetails.story.author.id}
                    isAuth={!!user}
                    following={
                      (chapterDetails.story.author.followers ?? []).length > 0
                    }
                  />
                </>
              )}
            </div>
          </div> */}

          <div className="py-6">
            {chapterDetails.thumbnail && (
              <Image
                src={chapterDetails.thumbnail!}
                alt={chapterDetails.title!}
                width={1200}
                height={480}
                className="mb-8 h-[30rem] w-full rounded-lg object-cover"
              />
            )}

            <div className="py-8">
              <h1
                className={`mb-8 scroll-m-20 text-center text-3xl font-extrabold tracking-tight lg:text-5xl`}
              >
                {chapterDetails.title}
              </h1>

              <div className="mb-2 flex items-center justify-center gap-2">
                <div className="px-2">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1">
                      <ViewIcon size={16} className="mt-1 stroke-2" />
                      <p>Reads</p>
                    </div>
                    <p className="font-bold">
                      {formatNumber(chapterDetails.story.reads)}
                    </p>
                  </div>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="px-2">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1">
                      <StarIcon size={16} />
                      <p>Likes</p>
                    </div>
                    <p className="font-bold">
                      {formatNumber(chapterDetails.story.love)}
                    </p>
                  </div>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="px-2">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1">
                      <LeftToRightListNumberIcon size={16} />
                      <p>Chapters</p>
                    </div>
                    <p className="font-bold">
                      {(chapterDetails.story.chapters ?? []).length}
                    </p>
                  </div>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="px-2">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1">
                      <BookOpen01Icon size={16} />
                      <p>Time</p>
                    </div>
                    <p className="text-center font-bold">
                      {formatReadingTime(chapterDetails.readingTime)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative border-y border-border bg-slate-100 px-4 py-12">
          <div className="borer absolute -top-4 left-1/2 -translate-x-1/2 rounded-full border border-border bg-slate-200/80 p-2">
            <SquareLock02Icon size={15} className="text-accent" />
          </div>
          <div className="mx-auto w-full max-w-screen-xl px-4 py-8">
            <div className="mx-auto w-7/12 flex-1">
              <h3 className="mb-4 text-center text-2xl font-semibold">
                Show your support for {chapterDetails.story.author.name}, and
                continue reading this story
              </h3>
              <p className="mb-8 text-center">
                Unlock this story part or the entire story. Either way, your
                Coins help writers earn money for the stories you love.
              </p>
              <div className="mb-3">
                <UnlockSection
                  chapterId={chapterDetails.id}
                  totalChapterPrice={chapterDetails.story.totalChapterPrice}
                  price={chapterDetails.price}
                />
              </div>

              <p className="text-center text-foreground">
                Total Premium Chapters:{" "}
                {
                  chapterDetails.story.chapters.filter(
                    (chapter) => chapter.price > 0,
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (chapterDetails.content === null) notFound();

  //? Authenticated author: Always show chapter content
  //? Authenticated non-author: Show only if chapter is published
  //? Unauthenticated user: Show only if chapter is published

  return (
    <>
      <ChapterHeader
        chapterDetails={{
          id: chapterDetails.id,
          published: chapterDetails.published,
          story: {
            id: chapterDetails.story.id,
            thumbnail: chapterDetails.story.thumbnail,
            title: chapterDetails.story.title,
            slug: chapterDetails.story.slug,
            author: {
              id: chapterDetails.story.author.id,
              username: chapterDetails.story.author.username,
              followers: chapterDetails.story.author.followers,
            },
            chapters: chapterDetails.story.chapters,
            published: chapterDetails.published,
          },
        }}
        user={user}
      />

      <ReadQuery id={chapterDetails.id} />

      {user?.id === chapterDetails.story.author.id ||
      chapterDetails.published ? (
        <section className="w-full">
          <div className="mx-auto max-w-screen-xl px-4">
            <div className="py-6">
              {chapterDetails.thumbnail && (
                <Image
                  src={chapterDetails.thumbnail!}
                  alt={chapterDetails.title!}
                  width={1200}
                  height={480}
                  className="mb-8 h-96 w-full rounded-lg object-cover"
                />
              )}

              <div className="py-0 sm:py-8">
                <h1
                  className={`mb-8 scroll-m-20 text-center text-3xl font-extrabold tracking-tight lg:text-5xl`}
                >
                  {chapterDetails.title}
                </h1>

                <div className="mb-2 flex flex-wrap items-center justify-center gap-2">
                  <div className="px-2">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1">
                        <ViewIcon size={16} />
                        <p>Reads</p>
                      </div>
                      <p className="font-bold">
                        {formatNumber(chapterDetails.story.reads)}
                      </p>
                    </div>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <div className="px-2">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1">
                        <StarIcon size={16} />
                        <p>Likes</p>
                      </div>
                      <p className="font-bold">
                        {formatNumber(chapterDetails.story.love)}
                      </p>
                    </div>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <div className="px-2">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1">
                        <LeftToRightListNumberIcon size={16} />
                        <p>Chapters</p>
                      </div>
                      <p className="font-bold">
                        {(chapterDetails.story.chapters ?? []).length}
                      </p>
                    </div>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <div className="px-2">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1">
                        <BookOpen01Icon size={16} />
                        <p>Time</p>
                      </div>
                      <p className="font-bold">
                        {formatReadingTime(chapterDetails.readingTime)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto flex max-w-screen-md flex-col items-center justify-stretch gap-8 border-t border-border py-4 sm:py-8">
              <div
                className={`${contentFont.className} w-full max-w-none space-y-4 whitespace-pre-line text-lg leading-relaxed text-foreground md:text-xl`}
                dangerouslySetInnerHTML={{
                  __html: generateHTML(chapterDetails.content as JSONContent, [
                    Placeholder,
                    Youtube,
                    TLink,
                    Underline,
                    TImage,
                    CharacterCount,
                    TextStyle,

                    // @ts-expect-error: A bug due to overlaping with textalign from tiptap with noval
                    StarterKit,
                    TextAlign.configure({
                      types: ["paragraph"],
                    }),
                  ]),
                }}
              ></div>

              {chapterDetails.nextChapter ? (
                <Link href={`/chapter/${chapterDetails.nextChapter?.slug}`}>
                  <Button className="mx-auto w-72">
                    Continue to next Chapter
                  </Button>
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
                    Follow the author to get notified when they publish a new
                    story
                  </p>
                </div>
              )}

              <div className="grid w-full grid-cols-2 gap-2 xs:w-auto">
                <UpVote story={chapterDetails.story.id} />

                <ShareButton />
              </div>

              <div className="pb-4">
                <h1 className="mb-4 text-center text-2xl font-bold">Tags:</h1>
                <div className="flex flex-wrap gap-2">
                  {chapterDetails.story.tags.length > 0 ? (
                    chapterDetails.story.tags.map((tag) => (
                      <Link href={`/tag/${tag}`} key={tag}>
                        <Badge variant="secondary">{tag}</Badge>
                      </Link>
                    ))
                  ) : (
                    <p className="mx-auto text-center text-lg text-gray-500">
                      No tags in this story
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <section className="w-full">
            <div className="mx-auto w-full max-w-[1440px] border-y border-border px-4 pb-0 pt-8 md:pb-6 md:pt-12">
              <Suspense fallback={<LoadingColumn />}>
                <StoriesArea
                  title="You'll also like"
                  perRow={6}
                  fetcher={() => fetchSimilar(slug)}
                  inRow={false}
                />
              </Suspense>
            </div>
          </section>
        </section>
      ) : (
        <NotFound />
      )}
    </>
  );
};

export default Chapter;
