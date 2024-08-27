"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";

export function FollowDialog({
  username,
  type,
  defaultValue,
}: {
  username: string;
  type: "followers" | "following";
  defaultValue: number;
}) {
  const { data, isLoading } = api.auth.followData.useQuery(
    {
      type: type,
      username: username,
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-slate-800 outline-none hover:text-slate-700 hover:underline">
          {type === "followers"
            ? `${defaultValue} Followers`
            : `${defaultValue} Following`}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <h1 className="text-xl font-semibold">
          {type === "followers" ? "Followers" : "Following"}
        </h1>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="ml-2">
                <Skeleton className="mb-2 h-4 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))
        ) : (
          <>
            {(data ?? []).length > 0 ? (
              data!.map((user) => (
                <div
                  key={user.username}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center">
                    <Image
                      width={32}
                      height={32}
                      src={user.profile}
                      alt={user.name}
                      className="size-12 rounded-full border border-border shadow-sm"
                    />
                    <div className="ml-2">
                      <p className="text-lg font-medium">{user.name}</p>
                      <p className="text-base text-gray-500">{user.username}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-lg text-foreground">
                {type === "followers"
                  ? "No followers yet"
                  : "Not following anyone yet"}
              </p>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
