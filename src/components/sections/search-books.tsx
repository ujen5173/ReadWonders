import { BookMarked, FilterX, Headphones } from "lucide-react";
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
import { cn } from "~/utils/cn";
import Card from "../Card";
import { Button, buttonVariants } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

type Props = {
  infiniteScroll?: boolean;
  title?: string;
  defaultValue?: string;
};

const SearchBooks = ({
  infiniteScroll = true,
  defaultValue = "",
  title = "Search Books",
}: Props) => {
  return (
    <section className="w-full">
      <div className="container border-b border-border px-4 py-8">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h1 className="text-2xl font-bold text-primary">{title}</h1>
          <Dialog>
            <DialogTrigger
              className={cn(buttonVariants({ variant: "outline" }), "gap-1")}
            >
              <FilterX size={18} className="text-text-secondary" />
              Filter
            </DialogTrigger>
            <DialogContent>
              <h1 className="text-xl font-bold text-text-primary">Filter</h1>
              <main>
                <div className="mb-8">
                  <h1 className="text-lg font-medium text-text-primary">
                    Length
                  </h1>
                  <p className="mb-2 text-text-secondary">
                    You can select multiple options
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="any" />
                      <Label className="text-base" htmlFor="any">
                        Any chapter length
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="1_10" />
                      <Label className="text-base" htmlFor="1_10">
                        1 - 10 chapters
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="10_20" />
                      <Label className="text-base" htmlFor="10_20">
                        10 - 20 chapters
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="20_50" />
                      <Label className="text-base" htmlFor="20_50">
                        20 - 50 chapters
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="50_more" />
                      <Label className="text-base" htmlFor="50_more">
                        50+ chapters
                      </Label>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <Switch id="mature_content" />
                    <Label htmlFor="mature_content">Show Mature content</Label>
                  </div>
                </div>
              </main>
              <DialogFooter className="flex justify-end">
                <Button variant="outline">Reset</Button>
                <Button>Apply</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <section className="mb-4 flex flex-col flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-slate-50 p-2 shadow-sm xs:flex-row xs:gap-0">
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
            defaultValue={defaultValue}
            placeholder="Search books..."
            className="w-full bg-white xs:w-4/12"
          />
        </section>

        <main className="mb-4 grid grid-cols-1 gap-4 xxs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {allBooks.map((book) => (
            <Card key={book.id} details={book} />
          ))}
        </main>
      </div>
    </section>
  );
};

export default SearchBooks;

export const SelectGenre = () => {
  return (
    <Select>
      <SelectTrigger className="w-full bg-white xs:w-4/12">
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
