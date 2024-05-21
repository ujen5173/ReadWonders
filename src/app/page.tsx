"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

const Homepage = () => {
  const { data: books } = api.book.getAll.useQuery();
  const { data: user } = api.auth.getProfile.useQuery();

  console.log({ books, user });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <div className="flex flex-col items-center gap-6">
          <pre className="text-wrap text-white">
            {JSON.stringify(books, null, 2)}
          </pre>
          <pre className="text-wrap text-white">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div className="flex w-full flex-1 flex-col items-center gap-4 text-white">
          {user ? (
            <>
              Logged in as {user.name}
              <Button className="text-lg text-white">Logout</Button>
            </>
          ) : (
            <Link href="/login" className="text-lg text-white">
              Login
            </Link>
          )}
        </div>
      </div>
    </main>
  );
};

export default Homepage;
