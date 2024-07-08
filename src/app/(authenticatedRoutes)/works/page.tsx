"use client";

import { PlusSignSquareIcon } from "hugeicons-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { DataTable } from "./_components/data-table";

const Works = () => {
  const { data, isLoading } = api.story.work.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[1440px] border-b border-border px-4 py-6">
        <div className="flex items-center justify-between gap-6">
          <h1 className={`scroll-m-20 text-3xl font-bold tracking-tight`}>
            My Stories
          </h1>

          <Link href="/write">
            <Button>
              <PlusSignSquareIcon className="size-4" />
              <span>Create New Story</span>
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="py-12 text-center">Loading...</div>
        ) : (
          <DataTable data={data ?? []} />
        )}
      </div>
    </section>
  );
};

export default Works;
