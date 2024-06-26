import { Dot, Mail, PlusSquare } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import ReadingListSection from "~/app/(authenticatedRoutes)/reading-list/_components/reading-list-section";
import { Icons } from "~/components/Icons";
import CoverCard from "~/components/cover-card";
import { Button } from "~/components/ui/button";
import { constructMetadata, getBaseUrl, siteConfig } from "~/config/site";
import { api } from "~/trpc/server";
import { formatNumber } from "~/utils/helpers";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const user = await api.auth.userProfile.query({ username: params.slug });

  if (!user) {
    return;
  }

  return constructMetadata({
    title: `${user.name} - ${siteConfig.name}`,
    image: user.profile ? user.profile : `${getBaseUrl()}/og-image.jpg`,
    publishedTime: user.createdAt.toString(),
    url: `${getBaseUrl()}/user/${params.slug}`,
  });
}

const UserProfile = async ({ params }: { params: { slug: string } }) => {
  const userDetails = await api.auth.userProfile.query({
    username: params.slug,
  });

  if (!userDetails) return null;

  return (
    <>
      <div className="mx-auto min-h-96 w-full max-w-[1440px] px-4">
        <div className="border-b border-border py-8">
          <div className="mb-6 flex flex-wrap gap-2">
            <Image
              alt={userDetails.name!}
              src={userDetails.profile!}
              width={120}
              height={120}
              className="size-16 rounded-full object-cover"
            />

            <div>
              <div className="mb-1 flex flex-wrap items-baseline gap-2">
                <h1 className="mb-2 text-4xl font-semibold text-primary">
                  {userDetails.name!}
                </h1>
                <span className="text-center text-2xl font-medium text-slate-600 underline">
                  @{userDetails.username!}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap items-center text-base font-medium text-slate-700 xxs:mt-0">
                <div>
                  <span>{userDetails.stories?.length} works</span>
                </div>
                <Dot size={20} />
                <div>
                  <span>{formatNumber(561)} following</span>
                </div>
                <Dot size={20} />
                <div>
                  <span>{formatNumber(5486516)} followers</span>
                </div>
              </div>
            </div>
          </div>

          <p className="my-4 text-lg text-foreground">
            {userDetails.bio || "No bio provided"}
          </p>

          {userDetails.tagline && (
            <blockquote className="border-l-2 border-primary pl-2 text-lg font-medium italic">
              &quot;{userDetails.tagline}&quot;
            </blockquote>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-8">
            <div className="flex flex-wrap items-center gap-2">
              <Button className="gap-1" variant="secondary">
                <Icons.wattpad className="size-4" />
                <span>Wattpad</span>
              </Button>
              <Button className="gap-1" variant="secondary">
                <Icons.pinterest className="size-4" />
                <span>Pinterest</span>
              </Button>
              <Button className="gap-1" variant="secondary">
                <Mail className="size-4" />
                <span>E-mail</span>
              </Button>
              <Button className="gap-1" variant="secondary">
                <Icons.discord className="size-4" />
                <span>Discord</span>
              </Button>
            </div>

            <Button className="gap-1">
              <PlusSquare className="size-4" />
              <span>Follow {userDetails.username}</span>
            </Button>
          </div>
        </div>

        <div className="border-b border-border py-6">
          <h1 className="mb-4 text-2xl font-medium">
            {userDetails.name!}&apos;s Works
          </h1>

          <main className="relative grid w-full grid-cols-1 place-items-center gap-5 xxxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {userDetails.stories.length > 0 ? (
              userDetails.stories.map((story) => (
                <CoverCard key={story.id} details={story} />
              ))
            ) : (
              <div className="flex h-40 w-full items-center justify-center">
                <h1 className="text-2xl font-medium text-slate-600">
                  No works found
                </h1>
              </div>
            )}
          </main>
        </div>

        <div className="py-6">
          <h1 className="mb-4 text-2xl font-medium">
            {userDetails.name!}&apos;s Reading List
          </h1>

          <ReadingListSection userId={userDetails.id} />
        </div>
      </div>
    </>
  );
};

export default UserProfile;
