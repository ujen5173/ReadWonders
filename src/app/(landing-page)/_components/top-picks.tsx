import { ArrowDown } from "lucide-react";
import Card from "~/components/Card";
import { topPicks } from "~/data";

const TopPicks = () => {
  return (
    <section className="w-full">
      <div className="container mx-auto border-b border-border px-4 py-8">
        <div className="mb-4 flex items-center gap-2">
          <h1 className="text-xl font-semibold text-primary lg:text-2xl">
            Tops Picks on different genres
          </h1>
          <ArrowDown size={18} className="text-primary" />
        </div>

        <main className="xxs:grid-cols-2 mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {topPicks.map((topPick) => (
            <div key={topPick.id} className="mx-auto w-full max-w-[270px]">
              <div className="mb-2 flex items-center gap-1">
                <span className="text-xl font-semibold text-primary">1.</span>
                <span className="text-text-light line-clamp-1 text-sm font-medium">
                  Appers in #1 on {topPick.category}
                </span>
              </div>
              <Card details={topPick} />
            </div>
          ))}
        </main>
      </div>
    </section>
  );
};

export default TopPicks;
