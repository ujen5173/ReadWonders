import BooksArea from "~/components/sections/books-area";

const TopPicks = () => {
  // const topPicks = api.book.topPicks.query({});

  // console.log({ topPicks });

  return (
    <section className="w-full">
      <div className="container border-b border-border px-4 py-8">
        <BooksArea
          title="Top Picks on different genres"
          // data={topPicks}
          carasoul={true}
          perRow={6}
        />
      </div>
    </section>
  );
};

export default TopPicks;
