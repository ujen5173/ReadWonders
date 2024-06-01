import TopPicks from "~/app/(landing-page)/_components/top-picks";
import BooksArea from "~/components/sections/books-area";
import Footer from "~/components/sections/footer";
import { getServerUser } from "~/utils/auth";
import ReadingList from "./_components/reading-list";

const Dashboard = async () => {
  const { user } = await getServerUser();

  return (
    <>
      <section className="w-full">
        <div className="container px-4 pb-6 pt-12">
          <div className="flex items-center justify-between">
            <h1 className="text-5xl font-semibold text-primary">
              Welcome home, {user?.user_metadata.full_name}!
            </h1>
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="container flex flex-col gap-4 border-b border-border px-4 py-8 lg:flex-row">
          <BooksArea title="Current Reads" carasoul={false} perRow={3} />
          <ReadingList perRow={3} />
        </div>
      </section>
      {/* <FeaturedAndLatest /> */}
      <TopPicks />
      <Footer />
    </>
  );
};

export default Dashboard;
