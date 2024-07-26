import { Suspense } from "react";
import FeaturedAndLatest from "~/app/(landing-page)/_components/featured-latest";
import MostLoved from "~/app/(landing-page)/_components/most-loved";
import Recommended from "~/app/(landing-page)/_components/recommended";
import TopPicks from "~/app/(landing-page)/_components/top-picks";
import { LoadingRow } from "~/components/Cardloading";
import CurrentReadsReadingList from "./_components/current-reads";
import Greetings from "./_components/greetings";

const Dashboard = () => {
  return (
    <>
      <Greetings />
      <CurrentReadsReadingList />
      <Suspense fallback={<LoadingRow />}>
        <FeaturedAndLatest />
      </Suspense>
      <Suspense fallback={<LoadingRow />}>
        <Recommended />
      </Suspense>
      <Suspense fallback={<LoadingRow />}>
        <MostLoved />
      </Suspense>
      <Suspense fallback={<LoadingRow />}>
        <TopPicks />
      </Suspense>
    </>
  );
};

export default Dashboard;
