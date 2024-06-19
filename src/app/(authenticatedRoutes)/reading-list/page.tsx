import { getServerUser } from "~/utils/auth";
import ReadingListSection from "./_components/reading-list-section";

const ReadingList = async () => {
  const user = await getServerUser();

  return (
    <>
      <section className="w-full">
        <div className="mx-auto w-full max-w-[1440px] px-4 pb-6 pt-12">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-semibold text-primary">
              Reading List
            </h1>
          </div>
          <ReadingListSection userId={user.user!.id} />
        </div>
      </section>
    </>
  );
};

export default ReadingList;
