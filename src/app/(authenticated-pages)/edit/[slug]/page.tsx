import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import EditBody from "./_components/edit-body";

const EditStory = async ({ params }: { params: { slug: string } }) => {
  const storyDetails = await api.story.getStoryForUpdate({
    slug: params.slug,
  });

  if (!storyDetails) return notFound();

  return <EditBody details={storyDetails} />;
};

export default EditStory;
