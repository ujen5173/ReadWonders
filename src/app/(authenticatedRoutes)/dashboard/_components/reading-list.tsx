import { ArrowDown } from "lucide-react";
import { type FC } from "react";
import CoverCard from "~/components/cover-card";

import { api } from "~/trpc/server";
import { cn } from "~/utils/cn";

type Props = {
  perRow?: 3 | 6;
};

const ReadingList: FC<Props> = async ({ perRow = 3 }) => {
  // const [carasoulApi, setCarasoulApi] = useState<CarouselApi>();

  const data = await api.story.getAll.query({
    limit: 3,
  });

  console.log({ data: data.length });

  return (
    <section className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-primary lg:text-2xl">
            Reading List
          </h1>
          <ArrowDown size={18} className="text-primary" />
        </div>
        {/* 
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              // carasoulApi?.scrollPrev();
            }}
            variant="outline"
            size="icon"
          >
            <ChevronLeft size={18} className="text-text-secondary" />
          </Button>
          <Button
            onClick={() => {
              // carasoulApi?.scrollNext();
            }}
            variant="outline"
            size="icon"
          >
            <ChevronRight size={18} className="text-text-secondary" />
          </Button>
        </div> */}
      </div>

      <main className={cn("flex w-full gap-6 xxs:basis-1/2 sm:basis-1/3")}>
        {data.map((item, index) => (
          <CoverCard details={item} key={index} />
        ))}
        {/* <Carousel
          opts={{
            align: "start",
          }}
          // setApi={setCarasoulApi}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {featuredStories.map((item, index) => (
              <CarouselItem
                key={index}
                className={cn(
                  "mb-4 xxs:basis-1/2 sm:basis-1/3",
                  perRow === 6 && "md:basis-1/4 lg:basis-1/5 xl:basis-1/6",
                )}
              >
                <CoverCard details={item} />
              </CarouselItem>
            ))}
            {perRow - featuredStories.length && (
              <CarouselItem
                className={cn(
                  "mb-4 block xxs:basis-1/2 sm:basis-1/3",
                  perRow === 6 && "md:basis-1/4 lg:basis-1/5 xl:basis-1/6",
                )}
              >
                <div className="flex h-96 cursor-pointer flex-col justify-center rounded-md border border-border p-6 text-center transition hover:bg-background">
                  <Plus size={36} className="mx-auto mb-4 text-text-primary" />
                  <h1 className="mb-2 text-2xl font-extrabold text-text-primary">
                    Add a story
                  </h1>
                  <p className="text-text-secondary">
                    Add a story to your reading list
                  </p>
                </div>
              </CarouselItem>
            )}
            {perRow - featuredStories.length - 1 > 0 &&
              Array(perRow - featuredStories.length - 1)
                .fill(0)
                .map((_, i) => (
                  <div className="mx-auto block flex-1" key={i} />
                ))}
          </CarouselContent>
        </Carousel> */}
      </main>
    </section>
  );
};

export default ReadingList;
