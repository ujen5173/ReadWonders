import {
  ArrowDown02Icon,
  Edit02Icon,
  NewTwitterIcon,
  RecordIcon,
  WebProgrammingIcon,
} from "hugeicons-react";
import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ReadingListSection from "~/app/(authenticatedRoutes)/reading-list/_components/reading-list-section";
import { Icons } from "~/components/Icons";
import { ShareButton } from "~/components/Share";
import CoverCard from "~/components/cover-card";
import FollowButton from "~/components/follow-button";
import { Button } from "~/components/ui/button";
import { constructMetadata, getBaseUrl, siteConfig } from "~/config/site";
import { api } from "~/trpc/server";
import { cn } from "~/utils/cn";
import { FollowDialog } from "./_components/follow-modal";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  try {
    const user = await api.auth.userProfile.query({ username: params.slug });

    if (!user) {
      return constructMetadata();
    }

    return constructMetadata({
      title: `${user.name} - ${siteConfig.name}`,
      image: user.profile ? user.profile : `${getBaseUrl()}/og-image.jpg`,
      url: `${getBaseUrl()}/user/${params.slug}`,
    });
  } catch (err) {
    return constructMetadata();
  }
}

const UserProfile = async ({ params }: { params: { slug: string } }) => {
  const userDetails = await api.auth.userProfile.query({
    username: params.slug,
  });

  const user = await api.auth.authInfo.query();

  return (
    <>
      <div className="mx-auto min-h-96 w-full max-w-[1440px] px-4">
        <div className="border-b border-border py-2 xs:py-4 sm:py-8">
          <div className="mb-6 flex flex-col flex-wrap items-center gap-2 sm:flex-row sm:items-start">
            <Image
              alt={userDetails.name!}
              src={userDetails.profile!}
              width={120}
              draggable={false}
              height={120}
              className="size-12 rounded-full object-cover sm:size-16"
            />

            <div>
              <div className="mb-1 flex flex-col flex-wrap items-center gap-0 sm:flex-row sm:gap-2">
                <h1 className="text-3xl font-bold text-primary md:text-4xl">
                  {userDetails.name!}
                </h1>
                <span className="text-center text-xl font-medium text-slate-600 underline md:text-2xl">
                  @{userDetails.username!}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2 text-base font-semibold text-slate-700 xxs:mt-0">
                <div>
                  <span>{userDetails.story?.length} works</span>
                </div>

                <RecordIcon className="size-[6px] fill-slate-600" />

                <FollowDialog
                  username={userDetails.username!}
                  defaultValue={userDetails.followersCount}
                  type="followers"
                />

                <RecordIcon className="size-[6px] fill-slate-600" />

                <FollowDialog
                  username={userDetails.username!}
                  defaultValue={userDetails.followingCount}
                  type="following"
                />
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

          <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
            <div className="grid w-full grid-cols-2 gap-2 xxs:grid-cols-3 xs:w-auto xs:grid-cols-4">
              {userDetails.twitter && (
                <Link
                  href={userDetails.twitter}
                  target="_blank"
                  className="w-full xs:w-auto"
                >
                  <Button className="w-full gap-1" variant="secondary">
                    <NewTwitterIcon className="size-4" />
                    <span>Twitter</span>
                  </Button>
                </Link>
              )}
              {userDetails.website && (
                <Link
                  href={userDetails.website}
                  target="_blank"
                  className="w-full xs:w-auto"
                >
                  <Button className="w-full gap-1" variant="secondary">
                    <WebProgrammingIcon className="size-4" />
                    <span>Website</span>
                  </Button>
                </Link>
              )}
              {userDetails.goodreads && (
                <Link
                  href={userDetails.goodreads}
                  target="_blank"
                  className="w-full xs:w-auto"
                >
                  <Button className="w-full gap-1" variant="secondary">
                    <Icons.goodreads className="size-4" />
                    <span>goodReads</span>
                  </Button>
                </Link>
              )}
              {userDetails.wattpad && (
                <Link
                  href={userDetails.wattpad}
                  target="_blank"
                  className="w-full xs:w-auto"
                >
                  <Button className="w-full gap-1" variant="secondary">
                    <Icons.wattpad className="size-4" />
                    <span>Wattpad</span>
                  </Button>
                </Link>
              )}
            </div>

            <div className="grid w-full grid-cols-2 gap-2 xxs:grid-cols-3 xs:w-auto xs:grid-cols-2">
              <ShareButton />

              {userDetails.id === user?.id ? (
                <Link href="/settings" className="w-full">
                  <Button className="w-full gap-2" variant="default">
                    <Edit02Icon className="size-4" />
                    <span>Edit Profile</span>
                  </Button>
                </Link>
              ) : (
                <FollowButton
                  id={userDetails.id}
                  isAuth={!!user}
                  following={(userDetails.followers ?? []).length > 0}
                />
              )}
            </div>
          </div>
        </div>

        <div className="border-b border-border py-6">
          <div className="border-b border-border py-6">
            <section className="flex-1">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <div className="mb-4 flex items-center gap-2">
                    <h1 className="text-2xl font-semibold text-primary">
                      {userDetails.name!}&apos;s Works
                    </h1>
                    <ArrowDown02Icon size={20} className="text-primary" />
                  </div>
                </div>
              </div>
              <main
                className={cn(
                  "relative grid w-full grid-cols-1 place-items-center gap-5 xxxs:grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
                  "xl:grid-cols-6",
                )}
              >
                {userDetails.story.map((story) => (
                  <CoverCard key={story.id} details={story} />
                ))}
                {Array(Math.abs(6 - userDetails.story.length))
                  .fill(0)
                  .map((_, i) => (
                    <div className="mx-auto block flex-1" key={i} />
                  ))}
              </main>
            </section>
          </div>
        </div>

        <div className="py-6">
          <h1 className="mb-4 text-2xl font-semibold">
            {userDetails.name!}&apos;s Reading List
          </h1>

          <ReadingListSection userId={userDetails.id} />
        </div>
      </div>
    </>
  );
};

export default UserProfile;
