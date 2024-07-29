import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import EditChapterBody from "./_components/body";

const EditChapter = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  const { data } = await api.chapter.getSingleChapter.query({
    slug: slug,
  });

  if (!data) return notFound();

  return <EditChapterBody chapter={data} />;
};

export default EditChapter;
