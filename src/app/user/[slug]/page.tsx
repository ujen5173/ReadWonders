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
import { notFound } from "next/navigation";
import { FollowDialog } from "~/app/_components/dialogs/follow-dialog";
import FollowButton from "~/app/_components/follow-button";
import ReadingListSection from "~/app/_components/reading-list/reading-list-section";
import { ShareButton } from "~/app/_components/share-button";
import CoverCard from "~/components/shared/cover-card";
import { Icons } from "~/components/shared/Icons";
import { Button, buttonVariants } from "~/components/ui/button";
import { constructMetadata, getBaseUrl, siteConfig } from "~/config/site";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/server";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  try {
    const user = await api.auth.userProfile({ username: params.slug });

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

const UserProfile = async ({
  params,
  searchParams,
}: {
  searchParams: Record<string, string>;
  params: { slug: string };
}) => {
  const userDetails = await api.auth.userProfile({
    username: params.slug,
    identity: searchParams?.identity ?? undefined,
  });

  const user = await api.auth.authInfo();

  const socialLinks = [
    { name: "Twitter", url: userDetails.twitter, icon: NewTwitterIcon },
    { name: "Website", url: userDetails.website, icon: WebProgrammingIcon },
    { name: "goodReads", url: userDetails.goodreads, icon: Icons.goodreads },
    { name: "Wattpad", url: userDetails.wattpad, icon: Icons.wattpad },
  ];

  if (!userDetails) return notFound();

  return (
    <>
      <div className="mx-auto min-h-96 w-full max-w-[1440px] px-4">
        <div className="xs:py-4 border-b border-border py-2 sm:py-8">
          <div className="mb-6 flex flex-col flex-wrap items-center gap-2 sm:flex-row sm:items-start">
            <Image
              alt={userDetails.name}
              src={userDetails.profile!}
              width={120}
              draggable={false}
              height={120}
              className="size-12 rounded-full object-cover sm:size-16"
            />

            <div>
              <div className="mb-1 flex flex-col flex-wrap items-center gap-0 sm:flex-row sm:gap-2">
                <h1 className="text-3xl font-bold text-primary md:text-4xl">
                  {userDetails.name}
                </h1>
                <span className="text-center text-xl font-medium text-slate-600 underline md:text-2xl">
                  @{userDetails.username}
                </span>
              </div>

              <div className="xxs:mt-0 mt-6 flex flex-wrap items-center gap-2 text-base font-semibold text-slate-700">
                <div>
                  <span>{userDetails.story?.length} works</span>
                </div>

                <RecordIcon className="size-[6px] fill-slate-600" />

                <FollowDialog
                  username={userDetails.username}
                  defaultValue={userDetails.followersCount}
                  type="followers"
                />

                <RecordIcon className="size-[6px] fill-slate-600" />

                <FollowDialog
                  username={userDetails.username}
                  defaultValue={userDetails.followingCount}
                  type="following"
                />
              </div>
            </div>
          </div>

          <p className="my-4 text-lg text-foreground">
            {userDetails.bio ?? "No bio provided"}
          </p>

          {userDetails.tagline && (
            <blockquote className="border-l-2 border-primary pl-2 text-lg font-medium italic">
              &quot;{userDetails.tagline}&quot;
            </blockquote>
          )}

          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <div className="flex flex-1 flex-wrap gap-2">
              {socialLinks.map((social) => {
                if (!social.url) return null;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonVariants({ variant: "secondary" })}
                  >
                    <social.icon className="size-4" />
                    <span>{social.name}</span>
                  </a>
                );
              })}
            </div>

            <div className="flex gap-2">
              <ShareButton />
              {userDetails.id === user?.id ? (
                <Link href="/settings/profile">
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
          <section className="flex-1">
            <div>
              <div className="flex items-center justify-between gap-4">
                <div className="mb-4 flex items-center gap-2">
                  <h1 className="text-2xl font-semibold text-primary">
                    {userDetails.name}&apos;s Works
                  </h1>
                  <ArrowDown02Icon size={20} className="text-primary" />
                </div>
              </div>
            </div>
            <main
              className={cn(
                "xxxs:grid-cols-2 xs:grid-cols-3 relative grid w-full grid-cols-1 place-items-center gap-5 md:grid-cols-4 lg:grid-cols-5",
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

        <div className="py-6">
          <h1 className="mb-4 text-2xl font-semibold">
            {userDetails.name}&apos;s Reading List
          </h1>

          <ReadingListSection userId={userDetails.id} />
        </div>
      </div>
    </>
  );
};

export default UserProfile;
