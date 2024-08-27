import { type Metadata } from "next";
import { notFound } from "next/navigation";
import CoverCard from "~/components/shared/cover-card";
import { constructMetadata, getBaseUrl, siteConfig } from "~/config/site";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/server";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  return constructMetadata({
    title: `${params.slug} - ${siteConfig.name}`,
    url: `${getBaseUrl()}/genre/${params.slug}`,
  });
}

const Genre = async ({ params }: { params: { slug: string } }) => {
  const data = await api.genre.getSingleGenre({ slug: params.slug });

  if (!data) notFound();

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[1440px] border-b border-border px-4 pb-6 pt-12">
        <h1 className="mb-6 text-2xl font-semibold xl:text-4xl">
          <span className="text-primary">
            &apos;&apos;
            {data.name}
            &apos;&apos;
          </span>{" "}
          Stories
        </h1>

        {(data ?? []).stories === 0 ? (
          <div className="w-full py-12 text-center">
            <h2 className="text-xl font-medium">
              No stories found in this genre.
            </h2>
          </div>
        ) : (
          <main
            className={cn(
              "xxxs:grid-cols-2 xs:grid-cols-3 relative grid w-full grid-cols-1 place-items-center gap-5 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
            )}
          >
            {data.story.map((story) => (
              <CoverCard key={story.id} details={story} />
            ))}
          </main>
        )}
      </div>
    </section>
  );
};

export default Genre;
