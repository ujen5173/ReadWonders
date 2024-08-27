import {
  BookOpen01Icon,
  Edit01Icon,
  FavouriteIcon,
  LeftToRightListNumberIcon,
  Notebook01Icon,
  ViewIcon,
} from "hugeicons-react";
import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FollowButton from "~/app/_components/follow-button";
import RatingButton from "~/app/_components/rating-button";
import StartReading from "~/app/_components/reading-list/start-reading";
import { ShareButton } from "~/app/_components/share-button";
import ReadingListModel from "~/components/shared/reading-list-modal";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { contentFont } from "~/config/font";
import { constructMetadata, getBaseUrl, siteConfig } from "~/config/site";
import { formatNumber, formatReadingTime } from "~/lib/helpers";
import { api } from "~/trpc/server";
import Chapters from "./_components/chapters";
import Comments from "./_components/comments";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  try {
    const story = await api.story.getSingle({ slug: params.slug });

    if (!story) {
      return constructMetadata();
    }

    return constructMetadata({
      title: `${story.title} - ${siteConfig.name}`,
      description: story.description,
      image: story.thumbnail ? story.thumbnail : `${getBaseUrl()}/og-image.jpg`,
      publishedTime: story.createdAt.toString(),
      url: `${getBaseUrl()}/story/${params.slug}`,
    });
  } catch (err) {
    return constructMetadata();
  }
}

const Story = async ({ params }: { params: { slug: string } }) => {
  const storyDetails = await api.story.getSingle({
    slug: params.slug,
  });

  const user = await api.auth.authInfo();

  return (
    <section className="w-full">
      <div className="mx-auto flex w-full max-w-[1440px] border-b border-border py-6">
        <div className="z-10 flex w-full flex-col gap-6 px-4 py-0 sm:p-4 md:flex-row md:gap-8 md:p-6 lg:p-8">
          <div className="relative mx-auto mb-6 flex w-full max-w-80 flex-col items-center gap-8 md:mb-0">
            <Image
              alt="Story cover"
              loading="eager"
              width="440"
              height="860"
              src={storyDetails.thumbnail}
              className="story-cover-thumbnail h-[450px] w-full overflow-hidden rounded-lg object-fill shadow-2xl sm:h-auto"
            />

            <div className="mx-auto flex w-10/12 flex-col gap-4">
              <StartReading
                hasChapter={
                  storyDetails?.chapters &&
                  (storyDetails.chapters ?? []).length > 0
                    ? `/chapter/${storyDetails.chapters[0]?.slug}`
                    : null
                }
              />

              <RatingButton
                ratingDetails={{
                  ratingCount: storyDetails.ratingCount,
                  ratingAverage: storyDetails.averageRating,
                  userRating: storyDetails.ratings,
                }}
                storyId={storyDetails.id}
              />

              <ReadingListModel bookId={storyDetails.id} />
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button disabled className="w-full" variant="secondary">
                        <Notebook01Icon className="size-4" />
                        Add notes
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notes Comming Soon!</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <ShareButton />
            </div>
          </div>

          <div className="w-full flex-1 space-y-8 py-4">
            <header className="flex flex-col gap-4 md:flex-row md:justify-between">
              <div className="flex-1 space-y-2">
                <h1 className="scroll-m-20 text-3xl font-bold tracking-tight lg:text-5xl">
                  {storyDetails.title}
                </h1>

                <div className="flex items-center space-x-1 text-lg text-foreground">
                  <p className="">By</p>
                  <Link
                    className="font-medium text-primary underline"
                    href={`/user/${storyDetails.author.username}`}
                  >
                    <h2>{storyDetails.author.username}</h2>
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

              <div className="mt-2 gap-2">
                {/* <LikeStory id={storyDetails.id} love={storyDetails.love} /> */}

                {storyDetails.author.id === user?.id ? (
                  <Link href={`/edit/${storyDetails.slug}`}>
                    <Button className="w-full" variant="outline">
                      <Edit01Icon className="size-4 stroke-2" />
                      Edit Story
                    </Button>
                  </Link>
                ) : (
                  <FollowButton
                    id={storyDetails.author.id}
                    isAuth={!!user}
                    following={(storyDetails.author.followers ?? []).length > 0}
                  />
                )}
              </div>
            </header>

            <div className="mx-auto mb-2 flex max-w-[29rem] flex-wrap sm:m-0">
              <div className="flex-1">
                <div className="flex flex-1 flex-col items-center border-r border-border p-2 lg:py-0">
                  <div className="flex items-center gap-1">
                    <ViewIcon size={16} className="stroke-2" />
                    <p>Reads</p>
                  </div>

                  <p className="font-bold">
                    {formatNumber(storyDetails.reads)}
                  </p>
                </div>
              </div>

              <div className="flex-1">
                <div className="xxxs:border-r flex flex-1 flex-col items-center border-border p-2 lg:py-0">
                  <div className="flex items-center gap-1">
                    <FavouriteIcon size={16} className="stroke-2" />
                    <p>Likes</p>
                  </div>

                  <p className="font-bold">{formatNumber(storyDetails.love)}</p>
                </div>
              </div>

              <div className="flex-1">
                <div className="xxs:border-r flex flex-1 flex-col items-center border-r border-border p-2 lg:py-0">
                  <div className="flex items-center gap-1">
                    <LeftToRightListNumberIcon size={16} className="stroke-2" />
                    <p>Chapters</p>
                  </div>

                  <p className="font-bold">
                    {(storyDetails.chapters ?? []).length}
                  </p>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-1 flex-col items-center border-border p-2 lg:py-0">
                  <div className="flex items-center gap-1">
                    <BookOpen01Icon size={16} className="stroke-2" />
                    <p>Time</p>
                  </div>

                  <p className="text-center font-bold">
                    {formatReadingTime(storyDetails.readingTime)}
                  </p>
                </div>
              </div>
            </div>

            <article
              className={`max-w-none whitespace-pre-line ${contentFont.className}`}
            >
              <p className="mb-8 text-lg font-medium text-slate-600">
                {storyDetails.description}
              </p>

              <div className="">
                <h1 className="mb-2 text-lg font-semibold">Tags:</h1>
                <div className="flex flex-wrap gap-2">
                  {storyDetails.tags.length > 0 ? (
                    storyDetails.tags.map((tag) => (
                      <Badge
                        className="border border-border bg-slate-100 text-sm font-normal text-slate-700 hover:bg-slate-200"
                        key={tag}
                      >
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <p className="mx-auto text-center text-base text-foreground">
                      No tags available
                    </p>
                  )}
                </div>
              </div>
            </article>

            <Chapters
              userId={user?.id}
              storyDetails={{
                id: storyDetails.id,
                slug: storyDetails.slug,
                author: { id: storyDetails.author.id },
                chapters: storyDetails.chapters,
              }}
            />

            <div>
              <h4 className="scroll-m-20 border-b pb-2 text-2xl font-bold tracking-tight first:mt-0 sm:px-4">
                Comments:
              </h4>
              <div className="px-4 py-6">
                <Comments storyId={storyDetails.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;
