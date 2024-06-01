import { z } from "zod";
import { api } from "~/trpc/server";
import ChapterArea from "./_components/chapter-area";

export const chapterSchema = z.object({
  content: z.string(),
});

const NewStory = async ({
  params,
}: {
  params: {
    chapterId: string;
  };
}) => {
  const { chapterId } = params;

  const chapter = await api.chapter.getSingeChapter.query({
    id: chapterId,
  });

  console.log({ chapter });

  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1140px] px-4 py-8">
        <ChapterArea />
      </div>
    </section>
  );
};

export default NewStory;
