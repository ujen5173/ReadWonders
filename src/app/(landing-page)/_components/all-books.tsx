import { ArrowDown, BookMarked, ExternalLink, Headphones } from "lucide-react";
import Card from "~/components/Card";
import { Button, buttonVariants } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { allBooks, genres } from "~/data";

const AllBooks = () => {
  return (
    <section className="w-full">
      <div className="container mx-auto border-b border-border px-4 py-8">
        <div className="mb-4 flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-primary">All Books</h1>
          <ArrowDown size={18} className="text-primary" />
        </div>

        <section className="xs:flex-row xs:gap-0 mb-4 flex flex-col flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-slate-50 p-4 shadow-sm">
          <SelectGenre />

          <div className="flex items-center">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <div className={buttonVariants({ variant: "ghost-link" })}>
                    <BookMarked size={18} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>Books & Stories</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger className="">
                  <div className={buttonVariants({ variant: "ghost-link" })}>
                    <Headphones size={18} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>Audio & Podcasts</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Input
            placeholder="Search books..."
            className="xs:w-4/12 w-full bg-white"
          />
        </section>

        <main className="xxs:grid-cols-2 mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {allBooks.map((book) => (
            <Card key={book.id} details={book} />
          ))}
        </main>
        <div className="flex justify-end">
          <Button className="gap-2" variant="outline">
            <ExternalLink size={18} />
            Explore More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AllBooks;

const SelectGenre = () => {
  return (
    <Select>
      <SelectTrigger className="xs:w-4/12 w-full bg-white">
        <SelectValue placeholder="Genre" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        {genres.map((genre) => (
          <SelectItem
            key={genre.name}
            className="hover:cursor-pointer hover:bg-primary/10"
            value={genre.name}
          >
            {genre.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
