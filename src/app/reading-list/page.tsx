"use client";

import { ArrowDown01Icon } from "hugeicons-react";
import { useContext } from "react";
import {
  AuthContext,
  AuthContextType,
} from "~/providers/AuthProvider/AuthProvider";
import NewReadingModel from "./_components/new-reading-model";
import ReadingListSection from "./_components/reading-list-section";

const ReadingLists = () => {
  const user = useContext(AuthContext) as AuthContextType;

  return (
    <>
      <section className="w-full">
        <div className="mx-auto w-full max-w-[1440px] px-4 pb-6 pt-12">
          <div className="mb-8 flex flex-col items-start gap-4 xs:flex-row xs:items-center xs:justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-primary sm:text-3xl lg:text-4xl">
                Reading List
              </h1>
              <ArrowDown01Icon size={30} className="text-primary" />
            </div>

            <NewReadingModel />
          </div>

          <ReadingListSection showActions userId={user.user!.id} />
        </div>
      </section>
    </>
  );
};

export default ReadingLists;
