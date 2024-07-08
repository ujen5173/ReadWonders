import { ArrowDown02Icon } from "hugeicons-react";
import { Suspense } from "react";
import { LoadingRow } from "~/components/Cardloading";
import StoriesArea from "~/components/sections/stories-area";
import { api } from "~/trpc/server";

const Bookmarks = async () => {
  const stories = await api.story.getBookmark.query();

  return (
    <section className="w-full flex-col">
      <div className="mx-auto w-full max-w-[1440px] border-b border-border px-4 py-6">
        {stories.length > 0 ? (
          <Suspense fallback={<LoadingRow />}>
            <StoriesArea title="Bookmarks" stories={stories} />
          </Suspense>
        ) : (
          <div className="">
            <div className="flex items-center justify-between gap-4">
              <div className="mb-4 flex items-center gap-2">
                <h1 className="text-xl font-semibold text-primary sm:text-2xl">
                  Bookmarks
                </h1>
                <ArrowDown02Icon size={18} className="text-primary" />
              </div>
            </div>
            <p className="text-center text-gray-500">No bookmarks yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Bookmarks;
