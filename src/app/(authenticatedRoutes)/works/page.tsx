"use client";

import { PlusSquare } from "lucide-react";
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
      <div className="mx-auto w-full max-w-[1340px] border-b border-border py-6">
        <div className="flex items-center justify-between gap-6">
          <h1 className={`scroll-m-20 text-3xl font-bold tracking-tight`}>
            My Stories
          </h1>
          <Link href="/write">
            <Button>
              <PlusSquare className="size-4" />
              <span>Create New Story</span>
            </Button>
          </Link>
        </div>
        {isLoading ? (
          <div className="py-12 text-center">Loading...</div>
        ) : (
          <DataTable />
        )}
      </div>
    </section>
  );
};

export default Works;
