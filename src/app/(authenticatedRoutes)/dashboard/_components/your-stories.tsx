"use client";

import { ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Card from "~/components/Card";
import { Button } from "~/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "~/components/ui/carousel";
import { featuredStories, topPicks } from "~/data";

const YourStories = () => {
  const [api, setApi] = useState<CarouselApi>();

  return (
    <section className="w-full">
      <div className="container border-b border-border px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-primary lg:text-2xl">
              Bookshelf Log
            </h1>
            <ArrowDown size={18} className="text-primary" />
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                api?.scrollPrev();
              }}
              variant="outline"
              size="icon"
            >
              <ChevronLeft size={18} className="text-text-secondary" />
            </Button>
            <Button
              onClick={() => {
                api?.scrollNext();
              }}
              variant="outline"
              size="icon"
            >
              <ChevronRight size={18} className="text-text-secondary" />
            </Button>
          </div>
        </div>

        <p className="mb-4 text-lg font-medium text-text-secondary">
          Books you&apos;ve found interesting
        </p>

        <main>
          <Carousel
            opts={{
              align: "start",
            }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {[...topPicks, ...featuredStories].map((item, index) => (
                <CarouselItem
                  key={index}
                  className="mb-4 xxs:basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                >
                  <Card details={item} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </main>
      </div>
    </section>
  );
};

export default YourStories;
