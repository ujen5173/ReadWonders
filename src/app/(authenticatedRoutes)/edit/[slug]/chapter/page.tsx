import { api } from "~/trpc/server";
import EditChapterBody from "./_components/body";

const EditChapter = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  const chapter = await api.chapter.getSingeChapter.query({
    slug: slug,
  });

  if (!chapter) return null;

  return <EditChapterBody slug={slug} chapter={chapter} />;
};

export default EditChapter;
