"use client";

import { PopoverClose } from "@radix-ui/react-popover";
import { PreferenceHorizontalIcon } from "hugeicons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";

// Define types for filter values
export type LengthFilter = "1-10" | "10-20" | "20-30" | "40+";
export type UpdatedFilter = "anytime" | "today" | "week" | "month";
export type BooleanFilter = boolean;

// Define the shape of the filters state
interface Filters {
  length?: LengthFilter;
  updated?: UpdatedFilter;
  premium?: BooleanFilter;
  mature?: BooleanFilter;
}

// Define valid filters constants
export const validFilters = {
  len: ["1-10", "10-20", "20-30", "40+"] as LengthFilter[],
  updated: ["anytime", "today", "week", "month"] as UpdatedFilter[],
};

const SearchHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getValidLength = (param: string | null): LengthFilter | undefined => {
    return validFilters.len.includes(param as LengthFilter)
      ? (param as LengthFilter)
      : undefined;
  };

  const getValidUpdated = (param: string | null): UpdatedFilter | undefined => {
    return validFilters.updated.includes(param as UpdatedFilter)
      ? (param as UpdatedFilter)
      : undefined;
  };

  const [filters, setFilters] = useState<Filters>({
    length: getValidLength(searchParams.get("length")) ?? "1-10",
    updated: getValidUpdated(searchParams.get("updated")) ?? "anytime",
    premium: searchParams.get("premium") === "true" ? true : false,
    mature: searchParams.get("mature") === "true" ? true : false,
  });

  // Effect to handle changes to searchParams or other side effects
  useEffect(() => {
    setFilters({
      length: getValidLength(searchParams.get("length")) ?? "1-10",
      updated: getValidUpdated(searchParams.get("updated")) ?? "anytime",
      premium: searchParams.get("premium") === "true" ? true : false,
      mature: searchParams.get("mature") === "true" ? true : false,
    });
  }, [searchParams]);

  const updateQueryParams = (
    params: Record<string, string | boolean | undefined>,
  ) => {
    const newParams = new URLSearchParams(searchParams);

    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined) {
        newParams.set(key, String(params[key]));
      } else {
        newParams.delete(key);
      }
    });
    router.push(`${pathname}?${newParams.toString()}`);
  };

  const onApply = () => {
    updateQueryParams({
      length: filters.length,
      updated: filters.updated,
      premium: filters.premium,
      mature: filters.mature,
    });
  };

  const onReset = () => {
    setFilters({
      length: undefined,
      updated: undefined,
      premium: false,
      mature: false,
    });
    updateQueryParams({
      length: undefined,
      updated: undefined,
      premium: undefined,
      mature: undefined,
    });
  };

  return (
    <div className="mb-8 flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center">
      <h1 className="space-x-1 text-xl font-bold md:text-2xl">
        <span>Search results for</span>
        <span className="text-primary">
          &quot;{searchParams.get("q")}&quot;
        </span>
      </h1>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary">
            <PreferenceHorizontalIcon size={18} className="text-foreground" />
            <span className="text-base">Filter</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-white">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="text-xl font-medium leading-none">Add Filters</h4>
              <p className="text-sm text-muted-foreground">
                Filter your search results to find the perfect story
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="length">Length</Label>
                <Select
                  value={filters.length ?? ""}
                  onValueChange={(value) => {
                    setFilters((prev) => ({
                      ...prev,
                      length: value as LengthFilter,
                    }));
                    updateQueryParams({ length: value });
                  }}
                >
                  <SelectTrigger className="col-span-2 bg-white">
                    <SelectValue placeholder="Chapter length" />
                  </SelectTrigger>
                  <SelectContent className="col-span-2 bg-white">
                    <SelectGroup>
                      <SelectItem value="1-10">1-10</SelectItem>
                      <SelectItem value="10-20">10-20</SelectItem>
                      <SelectItem value="20-30">20-30</SelectItem>
                      <SelectItem value="40+">40+</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="updated">Updated</Label>
                <Select
                  value={filters.updated ?? ""}
                  onValueChange={(value) => {
                    setFilters((prev) => ({
                      ...prev,
                      updated: value as UpdatedFilter,
                    }));
                    updateQueryParams({ updated: value });
                  }}
                >
                  <SelectTrigger className="col-span-2 bg-white">
                    <SelectValue placeholder="Last updated" />
                  </SelectTrigger>
                  <SelectContent className="col-span-2 bg-white">
                    <SelectGroup>
                      <SelectItem value="anytime">Anytime</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This week</SelectItem>
                      <SelectItem value="month">This month</SelectItem>
                      <SelectItem value="year">This year</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Separator className="my-1" />
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-4">
                  <Label htmlFor="premium">Premium</Label>
                  <Switch
                    id="premium"
                    checked={filters.premium ?? false}
                    onCheckedChange={(value) => {
                      setFilters((prev) => ({
                        ...prev,
                        premium: value,
                      }));
                      updateQueryParams({ premium: value });
                    }}
                  />
                </div>

                <Separator className="" orientation="vertical" />

                <div className="flex items-center gap-4">
                  <Label htmlFor="mature">Mature</Label>
                  <Switch
                    id="mature"
                    checked={filters.mature ?? false}
                    onCheckedChange={(value) => {
                      setFilters((prev) => ({
                        ...prev,
                        mature: value,
                      }));
                      updateQueryParams({ mature: value });
                    }}
                  />
                </div>
              </div>
              <div className="mt-4 flex w-full gap-2">
                <PopoverClose className="w-full">
                  <Button className="w-full" onClick={onApply}>
                    Apply
                  </Button>
                </PopoverClose>
                <PopoverClose className="w-full">
                  <Button
                    variant={"secondary"}
                    className="w-full"
                    onClick={onReset}
                  >
                    Reset
                  </Button>
                </PopoverClose>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SearchHeader;
