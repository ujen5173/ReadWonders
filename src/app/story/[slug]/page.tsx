import {
  BookOpen,
  Eye,
  Hash,
  Heart,
  LayoutList,
  Notebook,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { contentFont, fontInter } from "~/config/font";
import { cardHeight, cardWidth } from "~/server/constants";
import { api } from "~/trpc/server";
import { formatNumber, formatReadingTime } from "~/utils/helpers";

const Story = async ({ params }: { params: { slug: string } }) => {
  const storyDetails = await api.story.getSingle.query({ slug: params.slug });

  return (
    <section className="w-full">
      <div className="mx-auto flex w-full max-w-[1340px] py-6">
        <div className="z-10 flex w-full flex-col gap-6 p-4 md:flex-row md:gap-12 md:p-6 lg:p-12">
          <div className="relative flex w-fit flex-col items-center gap-8">
            <Image
              alt="Story cover"
              loading="eager"
              width="440"
              src={storyDetails.thumbnail}
              height="860"
              style={{
                width: cardWidth * 2 + "px",
                height: cardHeight * 1.75 + "px",
              }}
              className="w-full overflow-hidden rounded-lg object-cover shadow-2xl"
            />
            <div className="flex w-full flex-col gap-4">
              <Button className="w-full" variant="default">
                Start Reading
              </Button>
              <Button className="w-full gap-2" variant="secondary">
                <Star className="size-4" />
                <Star className="size-4" />
                <Star className="size-4" />
                <Star className="size-4" />
                <Star className="size-4" />
                <span>4.5</span>
              </Button>
              <Button className="w-full" variant="secondary">
                <Heart className="size-4" />
                Add to Reading list
              </Button>
              <Button className="w-full" variant="secondary">
                <Notebook className="size-4" />
                Add notes
              </Button>
            </div>
          </div>
          <div className="w-full flex-1 space-y-8">
            <header className="space-y-2">
              <h1
                className={`scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl ${fontInter.className}`}
              >
                {storyDetails.title}
              </h1>
              <div className="flex items-center space-x-1 text-lg text-foreground">
                <p className="">By</p>
                <Link className="hover:underline" href="/u">
                  <h2>{storyDetails.author.name}</h2>
                </Link>
              </div>
              <div>
                <a href="/categories/education">
                  <div className="inline-flex items-center rounded-full border border-transparent bg-primary px-2.5 py-0.5 text-xs text-primary-foreground transition-colors hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    <p className="font-normal capitalize tracking-wider">
                      Drama
                    </p>
                  </div>
                </a>
              </div>
            </header>
            <div className="mb-2 flex items-center gap-2">
              <div className="px-2">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    <Eye size={16} />
                    <p>Reads</p>
                  </div>
                  <p className="font-bold">
                    {formatNumber(storyDetails.reads)}
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
                    {formatNumber(Math.floor(storyDetails.reads / 4))}
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
                    {formatReadingTime(Math.floor(storyDetails.reads / 66))}
                  </p>
                </div>
              </div>
            </div>
            <article
              className={`max-w-none whitespace-pre-line ${contentFont.className}`}
            >
              <p className="mb-8">{storyDetails.description}</p>

              <div className="flex flex-wrap gap-2">
                {[
                  "asylum",
                  "dahyun",
                  "gxg",
                  "jihyo",
                  "mentaldisorder",
                  "mina",
                  "nayeon",
                  "sana",
                  "twice",
                  "twiceff",
                  "uribanotwice",
                  "wattys2022",
                ].map((tag) => (
                  <Badge
                    className="border border-border bg-slate-100 text-slate-800 hover:bg-slate-200"
                    key={tag}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </article>
            <div>
              <h4 className="scroll-m-20 border-b px-4 pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                Chapters:
              </h4>
              {storyDetails.chapter.length > 0 ? (
                storyDetails.chapter.map((ch, index) => (
                  <Link href={`/chapter/${ch.id}`} key={ch.id}>
                    <div className="flex cursor-pointer items-center justify-between border-b border-border p-4 last:border-0 hover:bg-slate-100">
                      <p className="text-xl font-bold text-slate-700">
                        <span className="inline-flex items-baseline gap-1 text-slate-600">
                          <Hash size={16} />
                          {index + 1}.
                        </span>{" "}
                        {ch.title}
                      </p>
                      <p className="text-md text-slate-500">
                        {ch.createdAt.toDateString()}
                      </p>
                    </div>
                  </Link>
                ))
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
