import { ArrowDown, PlusSquare } from "lucide-react";
import { Button } from "~/components/ui/button";
import { getServerUser } from "~/utils/auth";
import ReadingListSection from "./_components/reading-list-section";

const ReadingLists = async () => {
  const user = await getServerUser();

  return (
    <>
      <section className="w-full">
        <div className="mx-auto w-full max-w-[1440px] px-4 pb-6 pt-12">
          <div className="mb-8 flex flex-col items-start gap-4 xs:flex-row xs:items-center xs:justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-primary sm:text-3xl lg:text-4xl">
                Reading List
              </h1>
              <ArrowDown size={30} className="text-primary" />
            </div>
            <Button size={"lg"}>
              <PlusSquare size={24} />
              <span>Create Reading List</span>
            </Button>
          </div>

          <ReadingListSection userId={user.user!.id} />
        </div>
      </section>
    </>
  );
};

export default ReadingLists;
