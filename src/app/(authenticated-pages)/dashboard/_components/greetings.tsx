"use client";

import { useUser } from "~/hooks/use-user";

const Greetings = () => {
  const { user } = useUser();

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[1440px] px-4 pb-0 pt-8 md:pb-6 md:pt-12">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-primary sm:text-4xl">
            Welcome home, {user?.name}!
          </h1>
        </div>
      </div>
    </section>
  );
};

export default Greetings;
