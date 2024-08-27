import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import ChapterForm from "./chapter-form";

const ChapterPage = async ({ params }: { params: { slug: string } }) => {
  const chapterDetails = await api.chapter.getChapterForUpdate({
    slug: params.slug,
  });
 

  if (!chapterDetails) return notFound();

  return <ChapterForm chapterDetails={chapterDetails} />;
};

export default ChapterPage;
