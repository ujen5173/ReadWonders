"use client";

import { add, format } from "date-fns";
import {
  CalendarCheck as Calendar01Icon,
  ChevronLeft,
  MoreVertical as MoreVerticalIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "~/components/shared/Loading";
import Logo from "~/components/shared/Logo";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import { TimePickerDemo } from "~/components/ui/time-picker";
import { cn } from "~/lib/utils";

const WritingHeader = ({
  onSubmit,
  loading,
}: {
  onSubmit: (
    premium: boolean,
    coins: number,
    scheduledAt: Date | undefined,
  ) => void;
  loading: boolean;
}) => {
  const router = useRouter();
  const [date, setDate] = useState<Date>();
  const [premium, setPremium] = useState(false);
  const [coins, setCoins] = useState(0);

  /**
   * carry over the current time when a user clicks a new day
   * instead of resetting to 00:00
   */
  const handleSelect = (newDay: Date | undefined) => {
    if (!newDay) return;

    if (!date) {
      setDate(newDay);

      return;
    }

    const diff = newDay.getTime() - date.getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    const newDateFull = add(date, { days: Math.ceil(diffInDays) });

    setDate(newDateFull);
  };

  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-[1140px] items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              void router.back();
            }}
            size="icon"
            variant="ghost-link"
            className="p-1"
          >
            <ChevronLeft size={24} />
          </Button>
          <div>
            <p className="text-text-secondary text-xl font-bold">New Chapter</p>
          </div>
        </div>

        <div>
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button
            disabled={!!loading}
            onClick={() => onSubmit(premium, premium ? coins : 0, date)}
            size="sm"
          >
            {loading && <Spinner size={20} className="text-slate-50" />}
            Publish
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size={"icon"}>
                <MoreVerticalIcon size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 bg-white">
              <DropdownMenuLabel>Advance Options</DropdownMenuLabel>
              <Separator />
              <DropdownMenuGroup>
                <div className="space-y-2 p-2">
                  <p className="whitespace-nowrap">Schedule Work</p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <Calendar01Icon className="mr-2 h-4 w-4" />
                        {date ? (
                          format(date, "PPP HH:mm:ss")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto bg-white p-2">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => handleSelect(d)}
                        initialFocus
                      />
                      <div className="border-t border-border p-3">
                        <TimePickerDemo setDate={setDate} date={date} />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="p-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="premium">Premium</Label>
                    <Switch
                      onCheckedChange={(e) => setPremium(e)}
                      id="premium"
                    />
                  </div>
                </div>
                {premium && (
                  <div className="flex items-center gap-6 p-2">
                    <p className="whitespace-nowrap">Coins</p>
                    <Input
                      type="number"
                      defaultValue={10}
                      onChange={(e) => setCoins(+e.target.value)}
                      step={10}
                      placeholder="Price"
                      className="w-full"
                    />
                  </div>
                )}
              </DropdownMenuGroup>
              <div className="mt-4 flex justify-end gap-2 p-2">
                <Button variant="secondary">Reset</Button>
                <Button>Apply Changes</Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default WritingHeader;
