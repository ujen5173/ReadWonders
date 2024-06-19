import { Dot, Mail, PlusSquare } from "lucide-react";
import Image from "next/image";
import { Icons } from "~/components/Icons";
import CoverCard from "~/components/cover-card";
import Footer from "~/components/sections/footer";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";
import { formatNumber } from "~/utils/helpers";

const UserProfile = async ({ params }: { params: { slug: string } }) => {
  const userDetails = await api.auth.userProfile.query({
    username: params.slug,
  });

  console.log({ userDetails });

  if (!userDetails) return null;

  return (
    <>
      <div className="mx-auto min-h-96 w-full max-w-screen-xl px-4">
        <div className="border-b border-border py-8">
          <div className="mb-6 flex gap-2">
            <Image
              alt={userDetails.name!}
              src={userDetails.profile!}
              width={120}
              height={120}
              className="size-16 rounded-full object-cover"
            />

            <div>
              <div className="mb-1 flex items-baseline gap-1">
                <h1 className="mb-2 text-4xl font-semibold text-primary">
                  {userDetails.name!}
                </h1>
                <span className="text-center text-2xl font-medium text-slate-600">
                  @{userDetails.username!}
                </span>
              </div>

              <div className="flex items-center text-base font-medium text-slate-700">
                <div>
                  <span>{userDetails.story?.length} works</span>
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
          <p className="my-4 text-base text-foreground">
            {userDetails.bio || "No bio provided"}
          </p>

          {userDetails.tagline && (
            <blockquote className="border-l-2 border-primary pl-2 font-medium italic">
              &quot;{userDetails.tagline}&quot;
            </blockquote>
          )}

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
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
          <h1 className="mb-4 text-2xl font-bold">
            {userDetails.name!}&apos;s Works
          </h1>
          <div className="flex flex-wrap gap-2">
            {userDetails.story?.slice(0, 4).map((story) => (
              // <Card key={story.id} details={story} />
              <CoverCard key={story.id} details={story} />
            ))}
          </div>
        </div>
        <div className="border-b border-border py-6">
          <h1 className="mb-4 text-2xl font-bold">
            {userDetails.name!}&apos;s Reading List
          </h1>
          <div className="flex flex-wrap gap-2">
            {userDetails.story?.slice(8, 16).map((story) => (
              <CoverCard key={story.id} details={story} />
              // <CoverCard key={story.id} details={story} />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default UserProfile;
