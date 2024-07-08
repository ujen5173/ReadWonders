import {
  BookOpen01Icon,
  Edit01Icon,
  LeftToRightListNumberIcon,
  Notebook01Icon,
  StarIcon,
  ViewIcon,
} from "hugeicons-react";
import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ReadingListModel from "~/app/_components/reading-list-modal";
import FollowButton from "~/components/follow-button";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { contentFont } from "~/config/font";
import { constructMetadata, getBaseUrl, siteConfig } from "~/config/site";
import { api } from "~/trpc/server";
import { formatDate, formatNumber, formatReadingTime } from "~/utils/helpers";
import StartReading from "./_components/start-reading";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const story = await api.story.getSingle.query({ slug: params.slug });

  if (!story) {
    return;
  }

  return constructMetadata({
    title: `${story.title} - ${siteConfig.name}`,
    description: story.description,
    image: story.thumbnail ? story.thumbnail : `${getBaseUrl()}/og-image.jpg`,
    publishedTime: story.createdAt.toString(),
    url: `${getBaseUrl()}/story/${params.slug}`,
  });
}

const Story = async ({ params }: { params: { slug: string } }) => {
  const storyDetails = await api.story.getSingle.query({ slug: params.slug });

  const user = await api.auth.authInfo.query();

  return (
    <section className="w-full">
      <div className="mx-auto flex w-full max-w-[1340px] border-b border-border py-6">
        <div className="z-10 flex w-full flex-col gap-6 p-4 md:flex-row md:gap-12 md:p-6 lg:p-12">
          <div className="relative mx-auto flex w-full max-w-80 flex-col items-center gap-8">
            <Image
              alt="Story cover"
              loading="eager"
              width="440"
              height="860"
              src={storyDetails.thumbnail}
              className="story-cover-thumbnail w-full overflow-hidden rounded-lg object-fill shadow-2xl"
            />

            <div className="flex w-full flex-col gap-4">
              {user?.id === storyDetails.author.id && (
                <Link href={`/edit/${storyDetails.slug}`}>
                  <Button className="w-full" variant="secondary">
                    <Edit01Icon className="size-4" />
                    Edit Story
                  </Button>
                </Link>
              )}

              <StartReading
                hasChapter={
                  storyDetails &&
                  storyDetails.chapters &&
                  storyDetails.chapters.length > 0
                    ? `/chapter/${storyDetails.chapters[0]?.slug}`
                    : null
                }
              />

              <Button
                className="flex w-full items-center gap-1"
                variant="secondary"
              >
                <StarIcon className="size-4 fill-yellow-400 stroke-yellow-400" />
                <StarIcon className="size-4 fill-yellow-400 stroke-yellow-400" />
                <StarIcon className="size-4 fill-yellow-400 stroke-yellow-400" />
                <StarIcon className="size-4 fill-yellow-400 stroke-yellow-400" />
                <StarIcon className="size-4 fill-yellow-400 stroke-yellow-400" />
                <span>4.5</span>
              </Button>

              <ReadingListModel bookId={storyDetails.id} />

              <Button className="w-full" variant="secondary">
                <Notebook01Icon className="size-4" />
                Add notes
              </Button>
            </div>
          </div>

          <div className="w-full flex-1 space-y-8">
            <header className="flex items-center justify-between gap-4">
              <div className="flex-1 space-y-2">
                <h1
                  className={`scroll-m-20 text-3xl font-bold tracking-tight lg:text-5xl`}
                >
                  {storyDetails.title}
                </h1>

                <div className="flex items-center space-x-1 text-lg text-foreground">
                  <p className="">By</p>
                  <Link
                    className="font-medium text-primary underline"
                    href={`/user/${storyDetails.author.username}`}
                  >
                    <h2>{storyDetails.author.name}</h2>
                  </Link>
                </div>

                {storyDetails.category && (
                  <div>
                    <a href={`/genre/${storyDetails.category?.slug ?? ""}`}>
                      <div className="inline-flex items-center rounded-full border border-transparent bg-primary px-2.5 py-0.5 text-xs text-primary-foreground transition-colors hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                        <p className="font-normal capitalize tracking-wider">
                          {storyDetails.categoryName}
                        </p>
                      </div>
                    </a>
                  </div>
                )}
              </div>

              <FollowButton id={storyDetails.author.id} isAuth={!!user} />
            </header>

            <div className="mx-auto mb-2 flex max-w-[29rem] flex-wrap sm:m-0">
              <div className="flex-1">
                <div className="flex flex-1 flex-col items-center border-r border-border p-2 lg:py-0">
                  <div className="flex items-center gap-1">
                    <ViewIcon size={16} className="stroke-2" />
                    <p>Reads</p>
                  </div>

                  <p className="font-semibold">
                    {formatNumber(storyDetails.reads)}
                  </p>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-1 flex-col items-center border-border p-2 xxxs:border-r lg:py-0">
                  <div className="flex items-center gap-1">
                    <StarIcon size={16} className="stroke-2" />
                    <p>Likes</p>
                  </div>

                  <p className="font-semibold">
                    {formatNumber(storyDetails.love)}
                  </p>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-1 flex-col items-center border-r border-border p-2 xxs:border-r lg:py-0">
                  <div className="flex items-center gap-1">
                    <LeftToRightListNumberIcon size={16} className="stroke-2" />
                    <p>Chapters</p>
                  </div>

                  <p className="font-semibold">
                    {storyDetails.chapters.length}
                  </p>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-1 flex-col items-center border-border p-2 lg:py-0">
                  <div className="flex items-center gap-1">
                    <BookOpen01Icon size={16} className="stroke-2" />
                    <p>Time</p>
                  </div>

                  <p className="font-semibold">
                    {formatReadingTime(storyDetails.readingTime)}
                  </p>
                </div>
              </div>
            </div>

            <article
              className={`max-w-none whitespace-pre-line ${contentFont.className}`}
            >
              <p className="mb-8 text-lg">{storyDetails.description}</p>

              <div className="flex flex-wrap gap-2">
                {storyDetails.tags.map((tag) => (
                  <Badge
                    className="border border-border bg-slate-100 text-sm font-normal text-slate-700 hover:bg-slate-200"
                    key={tag}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </article>

            <div>
              <h4 className="mb-4 scroll-m-20 border-b px-4 pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                Chapters:
              </h4>

              {storyDetails.chapters.length > 0 ? (
                storyDetails.chapters.map((ch) =>
                  user?.id !== storyDetails.author.id &&
                  !ch.published ? null : (
                    <Link
                      key={ch.id}
                      target="_blank"
                      href={`/chapter/${ch.slug}`}
                      className="w-full"
                    >
                      <div className="flex items-center justify-between rounded-md px-4 py-2 hover:bg-rose-400/40">
                        <p className="line-clamp-1 text-lg text-slate-700">
                          {ch.title}
                        </p>
                        <div className="flex items-center gap-2">
                          {!ch.published && (
                            <Badge className="bg-rose-500 text-xs font-semibold text-white">
                              Draft
                            </Badge>
                          )}
                          <p className="xs:text-md whitespace-nowrap text-sm text-slate-500">
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

            <div>
              <h4 className="scroll-m-20 border-b px-4 pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                Disscussions:
              </h4>
              <div className="py-12">
                <p className="text-center text-lg text-foreground">
                  No discussions yet,{" "}
                  <span className="cursor-pointer text-primary underline">
                    Click here
                  </span>{" "}
                  to start one
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;
