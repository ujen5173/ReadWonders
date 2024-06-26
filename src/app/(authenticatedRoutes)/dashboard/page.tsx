import { ArrowDown } from "lucide-react";
import { Suspense } from "react";
import FeaturedAndLatest from "~/app/(landing-page)/_components/featured-latest";
import TopPicks from "~/app/(landing-page)/_components/top-picks";
import { LoadingColumn, LoadingRow } from "~/components/Cardloading";
import Footer from "~/components/sections/footer";
import StoriesArea from "~/components/sections/stories-area";
import { getServerUser } from "~/utils/auth";
import ReadingListSection from "../reading-list/_components/reading-list-section";

const Dashboard = async () => {
  const { user } = await getServerUser();

  return (
    <>
      <section className="w-full">
        <div className="mx-auto w-full max-w-[1440px] px-4 pb-0 pt-8 md:pb-6 md:pt-12">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold text-primary sm:text-4xl">
              Welcome home, {user?.user_metadata.full_name}!
            </h1>
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 border-b border-border px-4 py-8 xl:flex-row">
          <Suspense fallback={<LoadingColumn />}>
            <StoriesArea title="Current Reads" perRow={3} inRow={true} />
          </Suspense>

          <Suspense fallback={<LoadingColumn />}>
            <section className="flex-1">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <div className="mb-4 flex items-center gap-2">
                    <h1 className="text-xl font-semibold text-primary sm:text-2xl">
                      Reading List
                    </h1>
                    <ArrowDown size={18} className="text-primary" />
                  </div>
                </div>

                <ReadingListSection perRow={2} userId={user?.id!} />
              </div>
            </section>
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
