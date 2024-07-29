import { User } from "@supabase/supabase-js";
import { Edit01Icon } from "hugeicons-react";
import Link from "next/link";
import ReadingListModel from "~/app/_components/reading-list-modal";
import UserMenu from "~/app/_components/user-menu";
import Logo from "~/components/Logo";
import FollowButton from "~/components/follow-button";
import { Button } from "~/components/ui/button";
import Toc from "./toc";
import Visibility from "./visibility";

const ChapterHeader = ({
  chapterDetails,
  user,
}: {
  chapterDetails: {
    id: string;
    published: boolean;
    story: {
      id: string;
      thumbnail: string;
      title: string;
      slug: string;
      author: {
        id: string;
        username: string;
        followers: { id: string }[];
      };
      chapters: {
        id: string;
        slug: string | null;
        title: string | null;
        isPremium: boolean;
        sn: number;
        price: number;
      }[];
      published: boolean;
    };
  };
  user: User | null;
}) => {
  const { story, published, id } = chapterDetails;

  const userLoggedIn = !!user;

  return (
    <div className="w-full border-b border-border">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 px-4 py-2 pb-6 sm:flex-row sm:gap-6 sm:pb-2">
        <div className="flex-1">
          <div className="w-96">
            <Toc
              details={{
                story: {
                  thumbnail: story.thumbnail,
                  title: story.title,
                  slug: story.slug,
                  author: {
                    username: story.author.username,
                  },
                  chapters: story.chapters.map((ch) => ({
                    slug: ch.slug,
                    title: ch.title,
                    isPremium: ch.isPremium,
                  })),
                },
              }}
            />
          </div>
        </div>

        <div>
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          {userLoggedIn ? (
            <>
              <div className="grid w-full grid-cols-2 gap-2 xs:w-auto">
                {user.id === story.author.id ? (
                  <>
                    <Visibility id={id} published={published} />
                    <Link href={`/edit/${story.slug}/chapter`}>
                      <Button className="w-full" variant={"default"}>
                        <Edit01Icon size={20} />
                        Edit Story
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <ReadingListModel bookId={story!.id} />
                    <FollowButton
                      id={story.author.id}
                      isAuth={!!user}
                      following={(story.author.followers ?? []).length > 0}
                    />
                  </>
                )}
              </div>
              <UserMenu user={user} />
            </>
          ) : (
            <Link href="/auth/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterHeader;
