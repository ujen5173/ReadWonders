import { Suspense } from "react";
import FeaturedAndLatest from "~/app/(landing-page)/_components/featured-latest";
import TopPicks from "~/app/(landing-page)/_components/top-picks";
import { LoadingColumn, LoadingRow } from "~/components/Cardloading";
import Footer from "~/components/sections/footer";
import StoriesArea from "~/components/sections/stories-area";
import { getServerUser } from "~/utils/auth";

const Dashboard = async () => {
  const { user } = await getServerUser();

  return (
    <>
      <section className="w-full">
        <div className="mx-auto w-full max-w-[1440px] px-2 pb-6 pt-12">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-semibold text-primary">
              Welcome home, {user?.user_metadata.full_name}!
            </h1>
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 border-b border-border px-2 py-8 xl:flex-row">
          <Suspense fallback={<LoadingColumn />}>
            <StoriesArea title="Current Reads" perRow={3} inRow={true} />
          </Suspense>

          <Suspense fallback={<LoadingColumn />}>
            <StoriesArea
              title="Reading List"
              perRow={3}
              skipRow={4}
              inRow={true}
            />
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
