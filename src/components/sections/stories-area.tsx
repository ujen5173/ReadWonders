import { ArrowDown } from "lucide-react";
import { type FC } from "react";
import { api } from "~/trpc/server";
import { cn } from "~/utils/cn";
import CoverCard from "../cover-card";

type Props = {
  title: string;
  description?: string;
  carasoul?: boolean;
  perRow?: 3 | 6;
  skipRow?: number;
};

const StoriesArea: FC<Props> = async ({
  title,
  description,
  carasoul = true,
  perRow = 3,
  skipRow = 12,
}) => {
  // const [carasoulApi, setCarasoulApi] = useState<CarouselApi>();

  const data = await api.story.featuredStories.query({
    limit: perRow,
    skip: skipRow,
  });

  return (
    <section className="w-full">
      <div>
        <div className="flex items-center justify-between gap-4">
          <div className="mb-4 flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-primary">{title}</h1>
            <ArrowDown size={18} className="text-primary" />
          </div>

          {/* {carasoul && (
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
            </div>
          )} */}
        </div>

        {description && (
          <p className="mb-4 text-lg font-medium text-text-secondary">
            {description}
          </p>
        )}
      </div>

      {/* {carasoul ? (
        <Carousel
          opts={{
            align: "start",
          }}
          // setApi={setCarasoulApi}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {data.map((item, index) => (
              <CarouselItem
                key={index}
                className={cn(
                  "mb-4 xxs:basis-1/2 sm:basis-1/3",
                  carasoul &&
                    perRow === 6 &&
                    "md:basis-1/4 lg:basis-1/5 xl:basis-1/6",
                )}
              >
                <CoverCard details={item} />
              </CarouselItem>
            ))}
            {Array(Math.abs(perRow - (data.length ?? 0)))
              .fill(0)
              .map((_, i) => (
                <div className="mx-auto block flex-1" key={i} />
              ))}
          </CarouselContent>
        </Carousel>
      ) : ( */}
      <main
        className={cn(
          "flex w-full gap-6 xxs:basis-1/2 sm:basis-1/3",
          carasoul && perRow === 3 && "md:basis-1/4 lg:basis-1/5 xl:basis-1/6",
          carasoul && perRow === 6 && "md:basis-1/8 lg:basis-1/8 xl:basis-1/8",
        )}
      >
        {(data ?? []).map((story) => (
          <CoverCard key={story.id} details={story} />
        ))}

        {Array(Math.abs(perRow - (data ?? []).length))
          .fill(0)
          .map((_, i) => (
            <div className="mx-auto block flex-1" key={i} />
          ))}
      </main>
    </section>
  );
};

export default StoriesArea;
