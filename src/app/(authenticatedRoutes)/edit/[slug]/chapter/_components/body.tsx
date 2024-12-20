// TODO: save draft

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import { JSONContent } from "novel";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import WritingHeader from "~/components/sections/writing-header";
import { Button } from "~/components/ui/button";
import { FileUploader } from "~/components/ui/file-uploader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Label } from "~/components/ui/label";
import { toast } from "~/components/ui/use-toast";
import { useUploadFile } from "~/hooks/use-upload-thing";
import CustomEditor from "~/packages/Editor/advanced-editor";
import { api } from "~/trpc/react";
import { formSchema } from "~/types/zod";
import { getErrorMessage } from "~/utils/handle-errors";
import { autosaveContent, loadDraft } from "~/utils/storage";

const EditChapterBody = ({
  chapter,
}: {
  chapter: {
    nextChapter:
      | {
          id: string;
          slug: string | null;
          title: string | null;
          price: number;
        }
      | null
      | undefined;
    story: {
      slug: string;
      id: string;
      reads: number;
      thumbnail: string;
      title: string;
      tags: string[];
      love: number;
      chapters: {
        id: string;
        title: string | null;
        slug: string | null;
      }[];
      author: {
        id: string;
        username: string | null;
      };
    };
    id: string;
    title: string | null;
    slug: string | null;
    content: Prisma.JsonValue;
    thumbnail: string | null;
    reads: number;
    readingTime: number;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    storyId: string;
    published: boolean;
  };
}) => {
  const router = useRouter();
  const { replace } = router;

  const [preparingUpload, setPreparingUpload] = useState(false);
  const [imageLoad, setImageLoad] = useState(true);
  const [fileData, setFileData] = useState<
    { url: string; name: string } | undefined
  >({
    url: chapter?.thumbnail ?? "",
    name: "",
  });

  const { uploadFiles, progresses, uploadedFile, isUploading } =
    useUploadFile("imageUploader");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: chapter?.title ?? "",
      content: chapter?.content ?? "",
      thumbnail: chapter?.thumbnail ?? "",
      scheduledAt: null,
      premium: false,
      coins: 0,
    },
  });

  const [loading, setLoading] = useState<boolean>(false);

  const { mutateAsync } = api.chapter.update.useMutation();

  const onSubmit = async (
    premium: boolean,
    coins: number,
    scheduledAt: Date | undefined,
  ) => {
    try {
      setLoading(true);
      if (!chapter) {
        toast({ title: "Chapter not found." });

        return;
      }

      const draftData = await loadDraft(chapter.storyId, chapter.id);

      if (!draftData?.content) {
        toast({ title: "Please write something before publishing." });

        return;
      }

      await mutateAsync({
        title: form.getValues("title"),
        content: JSON.parse(draftData.content),
        thumbnail: uploadedFile?.url ?? null,
        id: chapter.id,
        published: scheduledAt ? false : true,
        isPremium: premium,
        coins,
        scheduledAt,
      });

      toast({ title: "Chapter Updated successfully" });
      replace(`/works`);
    } catch (err) {
      toast({
        title: getErrorMessage(err),
      });
    } finally {
      setLoading(false);
    }
  };

  const debouncedUpdates = useDebouncedCallback(async (e: string) => {
    if (chapter) {
      autosaveContent({
        draftKey: "title",
        value: e,
        story_id: chapter.storyId,
        chapterId: chapter.id,
      });
    }
  }, 1500);

  return (
    <>
      <WritingHeader loading={loading} onSubmit={onSubmit} />

      <section className="w-full">
        <div className="mx-auto max-w-[1140px] px-4 py-8">
          <Button variant="secondary" size="sm" className="mb-4">
            Enter Writing Mode
          </Button>
          <Form {...form}>
            <form onSubmit={undefined} className="w-full">
              <div className="mb-5">
                <Label>Cover Image</Label>
                <div className="h-[360px]">
                  <FileUploader
                    maxSize={4 * 1024 * 1024}
                    progresses={progresses}
                    uploadedFile={uploadedFile ?? fileData}
                    preparingUpload={preparingUpload}
                    setPreparingUpload={setPreparingUpload}
                    imageLoad={imageLoad}
                    setImageLoad={setImageLoad}
                    onUpload={(e) =>
                      uploadFiles(e, setPreparingUpload, setImageLoad)
                    }
                    disabled={isUploading}
                  />
                </div>
              </div>

              <FormItem className="w-full">
                <FormControl>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <input
                        type="text"
                        placeholder="Untitled part"
                        {...field}
                        onChange={async (e) => {
                          field.onChange(e);
                          debouncedUpdates(e.target.value);
                        }}
                        className="w-full border-b border-border bg-transparent py-4 text-center text-3xl font-semibold outline-none"
                        defaultValue="Untitled part"
                      />
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              <CustomEditor
                defaultContent={chapter?.content as JSONContent}
                details={{
                  chapterId: chapter?.id ?? "",
                  story_id: chapter?.storyId ?? "",
                  title: form.getValues("title"),
                  cover_image: fileData || { url: "", name: "" },
                }}
              />
            </form>
          </Form>
        </div>
      </section>
    </>
  );
};

export default EditChapterBody;
