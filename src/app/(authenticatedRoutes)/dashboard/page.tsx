import { ArrowDown02Icon } from "hugeicons-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import FeaturedAndLatest from "~/app/(landing-page)/_components/featured-latest";
import MostLoved from "~/app/(landing-page)/_components/most-loved";
import Recommended from "~/app/(landing-page)/_components/recommended";
import TopPicks from "~/app/(landing-page)/_components/top-picks";
import { LoadingColumn, LoadingRow } from "~/components/Cardloading";
import StoriesArea from "~/components/sections/stories-area";
import { api } from "~/trpc/server";
import { getServerUser } from "~/utils/auth";
import ReadingListSection from "../reading-list/_components/reading-list-section";

const Dashboard = async () => {
  const { user } = await getServerUser();

  const stories = await api.auth.currentReads.query({
    limit: 3,
  });

  if (!user) {
    redirect("/auth/login");
  }

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

      {stories.length > 0 && (
        <section className="w-full">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 border-b border-border px-4 py-8 xl:flex-row">
            <Suspense fallback={<LoadingColumn />}>
              <StoriesArea
                stories={stories}
                title="Current Reads"
                perRow={3}
                inRow={true}
              />
            </Suspense>

            <section className="flex-1">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <div className="mb-4 flex items-center gap-2">
                    <h1 className="text-xl font-semibold text-primary sm:text-2xl">
                      Reading List
                    </h1>
                    <ArrowDown02Icon size={18} className="text-primary" />
                  </div>
                </div>

                <ReadingListSection perRow={2} userId={user.id} />
              </div>
            </section>
          </div>
        </section>
      )}

      <Suspense fallback={<LoadingRow />}>
        <Recommended />
      </Suspense>

      <Suspense fallback={<LoadingRow />}>
        <MostLoved />
      </Suspense>

      <Suspense fallback={<LoadingRow />}>
        <TopPicks />
      </Suspense>

      <Suspense fallback={<LoadingRow />}>
        <FeaturedAndLatest />
      </Suspense>
    </>
  );
};

export default Dashboard;
