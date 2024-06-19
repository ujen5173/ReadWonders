import { Suspense } from "react";
import FeaturedAndLatest from "~/app/(landing-page)/_components/featured-latest";
import TopPicks from "~/app/(landing-page)/_components/top-picks";
import { LoadingColumn, LoadingRow } from "~/components/Cardloading";
import Footer from "~/components/sections/footer";
import StoriesArea from "~/components/sections/stories-area";
import { getServerUser } from "~/utils/auth";
import ReadingList from "./_components/reading-list";

const Dashboard = async () => {
  const { user } = await getServerUser();

  return (
    <>
      <section className="w-full">
        <div className="mx-auto w-full max-w-[1440px] px-4 pb-6 pt-12">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-semibold text-primary">
              Welcome home, {user?.user_metadata.full_name}!
            </h1>
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 border-b border-border px-4 py-8 xl:flex-row">
          <Suspense fallback={<LoadingColumn />}>
            <StoriesArea title="Current Reads" perRow={3} />
          </Suspense>

          <Suspense fallback={<LoadingColumn />}>
            <ReadingList perRow={3} />
          </Suspense>
        </div>
      </section>

      <Suspense fallback={<LoadingRow />}>
        <TopPicks />
      </Suspense>

      <Suspense fallback={<LoadingRow />}>
        <FeaturedAndLatest />
      </Suspense>
      <Footer />
    </>
  );
};

export default Dashboard;
