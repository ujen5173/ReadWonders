"use client";

import { ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { type CarouselApi } from "~/components/ui/carousel";

const YourStories = () => {
  const [api, setApi] = useState<CarouselApi>();

  return (
    <section className="w-full">
      <div className="max-w-screen-lg border-b border-border px-4 py-8">
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
          Stories you&apos;ve found interesting
        </p>

        <main>
          <p className="text-lg text-text-secondary">
            Your stories will appear here. You can add stories to your bookshelf
          </p>
        </main>
      </div>
    </section>
  );
};

export default YourStories;
