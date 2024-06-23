import { Share } from "lucide-react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";
import ReadingLists from "./_components/reading-lists";

const ReadingList = async ({ params }: { params: { slug: string } }) => {
  const data = await api.story.getReadingList.query({ slug: params.slug });

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[1440px] px-2">
        <div className="border-b border-border pb-6 pt-10">
          <div className="mb-6 flex items-center gap-4 ">
            <Image
              src={data.author.profile!}
              alt=""
              width={120}
              height={120}
              className="size-16 rounded-full"
            />
            <div>
              <h1 className=" text-4xl font-bold text-primary">
                {data.title}{" "}
                <span className="text-foreground">Reading List</span>
              </h1>
              <p className="text-lg text-foreground">7 books</p>
            </div>
          </div>

          <Button className="gap-2" variant={"outline"}>
            <Share size={16} />
            Share
          </Button>
        </div>

        <ReadingLists data={data} listId={params.slug} />
      </div>
    </section>
  );
};

export default ReadingList;
