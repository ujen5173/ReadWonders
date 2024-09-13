import { BookOpen, List, Lock, StarIcon, ViewIcon } from "lucide-react";
import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { type JSONContent } from "novel";
import { Suspense } from "react";
import { fetchSimilar } from "~/actions";
import { ShareButton } from "~/app/_components/share-button";
import NotFound from "~/app/not-found";
import { LoadingColumn } from "~/components/shared/Cardloading";
import StoriesArea from "~/components/shared/stories-area";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { constructMetadata, getBaseUrl, siteConfig } from "~/config/site";
import { formatDate, formatNumber, formatReadingTime } from "~/lib/helpers";
import { api } from "~/trpc/server";
import ChapterContent from "./_components/chapter-content";
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
    const { data: chapter } = await api.chapter.getSingleChapter({
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

  const { data: chapterDetails, hasPaid } = await api.chapter.getSingleChapter({
    slug,
  });

  const user = await api.auth.getProfile();

  if (!chapterDetails) return notFound();

  if (chapterDetails.isPremium && !hasPaid) {
    return (
      <section className="w-full">
        <ChapterHeader
          chapterDetails={{
            id: chapterDetails.id,
            slug: chapterDetails.slug,
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
          <div className="py-6">
            {chapterDetails.thumbnail && (
              <Image
                src={chapterDetails.thumbnail}
                alt={chapterDetails.title}
                width={1200}
                height={480}
                className="mb-8 h-[30rem] w-full rounded-lg object-cover"
              />
            )}

            <div className="py-8">
              <h1 className="mb-8 scroll-m-20 text-center text-3xl font-bold tracking-tight lg:text-5xl">
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
                      <List size={16} />
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
                      <BookOpen size={16} />
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
            <Lock size={15} className="text-slate-700" />
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
          slug: chapterDetails.slug,
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
      {chapterDetails.published ||
      user?.id === chapterDetails.story.author.id ? (
        <section className="w-full">
          <div className="mx-auto max-w-screen-xl px-4">
            <div className="py-6">
              {chapterDetails.thumbnail && (
                <Image
                  src={chapterDetails.thumbnail}
                  alt={chapterDetails.title}
                  width={1200}
                  height={480}
                  className="mb-8 h-96 w-full rounded-lg object-cover"
                />
              )}

              <div className="py-0 sm:py-8">
                <h1 className="mb-8 scroll-m-20 text-center text-3xl font-bold tracking-tight lg:text-5xl">
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
                        <List size={16} />
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
                        <BookOpen size={16} />
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
              <ChapterContent content={chapterDetails.content as JSONContent} />

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
