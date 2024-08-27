import { type Metadata } from "next";
import Image from "next/image";
import { ShareButton } from "~/app/_components/share-button";
import { constructMetadata, getBaseUrl, siteConfig } from "~/config/site";
import { api } from "~/trpc/server";
import ReadingLists from "./_components/reading-lists";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  try {
    const readinglist = await api.story.getReadingList({
      slug: params.slug,
    });

    if (!readinglist) {
      return constructMetadata();
    }

    return constructMetadata({
      title: `${readinglist.title} - ${siteConfig.name}`,
      url: `${getBaseUrl()}/user/${params.slug}`,
    });
  } catch (err) {
    return constructMetadata();
  }
}

const ReadingList = async ({ params }: { params: { slug: string } }) => {
  const data = await api.story.getReadingList({ slug: params.slug });

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[1440px] px-4">
        <div className="border-b border-border pb-6 pt-10">
          <div className="mb-6 flex items-center gap-4">
            <div className="hidden xs:block">
              <Image
                src={data.author.profile!}
                alt=""
                width={120}
                height={120}
                className="size-16 rounded-full"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary sm:text-4xl">
                {data.title}{" "}
                <span className="text-foreground">Reading List</span>
              </h1>
              <p className="text-lg text-foreground">
                {data.stories.length} book{data.stories.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <ShareButton />
        </div>

        <ReadingLists data={data} />
      </div>
    </section>
  );
};

export default ReadingList;
