"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { formatNumber } from "~/utils/helpers";

const data = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    thumbnail:
      "https://covers.bookcoverzone.com/slir/w450/png24-front/bookcover0029352.jpg",
    title: "The Hidden Kingdom",
    slug: "the-hidden-kingdom",
    reads: 12000,
    views: 25000,
    total_chapters: 20,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    thumbnail:
      "https://covers.bookcoverzone.com/slir/w450/png24-front/bookcover0024847.jpg",
    title: "Mysteries of the Night",
    slug: "mysteries-of-the-night",
    reads: 18000,
    views: 32000,
    total_chapters: 25,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    thumbnail:
      "https://covers.bookcoverzone.com/slir/w450/png24-front/bookcover0008885.jpg",
    title: "Journey to the Unknown",
    slug: "journey-to-the-unknown",
    reads: 15000,
    views: 28000,
    total_chapters: 18,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    thumbnail:
      "https://covers.bookcoverzone.com/slir/w450/png24-front/bookcover0007774.jpg",
    title: "The Lost Treasure",
    slug: "the-lost-treasure",
    reads: 21000,
    views: 35000,
    total_chapters: 22,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    thumbnail:
      "https://covers.bookcoverzone.com/slir/w450/png24-front/bookcover0029445.jpg",
    title: "Echoes of the Past",
    slug: "echoes-of-the-past",
    reads: 13000,
    views: 26000,
    total_chapters: 15,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    thumbnail:
      "https://covers.bookcoverzone.com/slir/w450/png24-front/bookcover0030661.jpg",
    title: "Shadow of the Dragon",
    slug: "shadow-of-the-dragon",
    reads: 17000,
    views: 30000,
    total_chapters: 24,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    thumbnail:
      "https://covers.bookcoverzone.com/slir/w450/png24-front/bookcover0026775.jpg",
    title: "Rise of the Phoenix",
    slug: "rise-of-the-phoenix",
    reads: 19000,
    views: 34000,
    total_chapters: 28,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440007",
    thumbnail:
      "https://covers.bookcoverzone.com/slir/w450/png24-front/bookcover0025008.jpg",
    title: "The Enchanted Forest",
    slug: "the-enchanted-forest",
    reads: 16000,
    views: 29000,
    total_chapters: 19,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440008",
    thumbnail:
      "https://covers.bookcoverzone.com/slir/w450/png24-front/bookcover0028601.jpg",
    title: "Chronicles of the Future",
    slug: "chronicles-of-the-future",
    reads: 14000,
    views: 27000,
    total_chapters: 21,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440009",
    thumbnail:
      "https://covers.bookcoverzone.com/slir/w450/png24-front/bookcover0028052.jpg",
    title: "Legend of the Star",
    slug: "legend-of-the-star",
    reads: 20000,
    views: 33000,
    total_chapters: 26,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440010",
    thumbnail:
      "https://covers.bookcoverzone.com/slir/w450/png24-front/bookcover0028200.jpg",
    title: "Whispers of the Ocean",
    slug: "whispers-of-the-ocean",
    reads: 11000,
    views: 22000,
    total_chapters: 17,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440011",
    thumbnail:
      "https://covers.bookcoverzone.com/slir/w450/png24-front/bookcover0030455.jpg",
    title: "Quest for the Lost City",
    slug: "quest-for-the-lost-city",
    reads: 14500,
    views: 27500,
    total_chapters: 23,
  },
];

export type Stories = {
  id: string;
  thumbnail: string;
  title: string;
  slug: string;
  reads: number;
  views: number;
  total_chapters: number;
};

export const columns: ColumnDef<Stories>[] = [
  {
    accessorKey: "id",
    header: "Id",
    cell: ({ row }) => (
      <div className="capitalize">
        {/* just one segment of the uuid  */}
        {(() => {
          const data = row.getValue("id") as string;
          return data.split("-")[data.split("-").length - 1];
        })()}
      </div>
    ),
  },
  {
    accessorKey: "thumbnail",
    header: "Thumbnail",
    cell: ({ row }) => (
      <div className="">
        <Image
          src={row.getValue("thumbnail")}
          width={120}
          height={60}
          className="h-24 w-16 rounded-md object-fill"
          alt=""
        />
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => <div className="">{row.getValue("slug")}</div>,
  },
  {
    accessorKey: "reads",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Reads
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">
        {(() => {
          const data = row.getValue("reads");
          return formatNumber(Number(data) ?? 0);
        })()}
      </div>
    ),
  },
  {
    accessorKey: "views",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Views
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">
        {(() => {
          const data = row.getValue("views");
          return formatNumber(Number(data) ?? 0);
        })()}
      </div>
    ),
  },
  {
    accessorKey: "total_chapters",
    header: () => <div className="text-right">Total Chapters</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">
          {row.getValue("total_chapters")}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white" align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy Story URL
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Story</DropdownMenuItem>
            <DropdownMenuItem>View User Details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function DataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white" align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getRowModel().rows?.length} of {table.getRowCount()} row(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
