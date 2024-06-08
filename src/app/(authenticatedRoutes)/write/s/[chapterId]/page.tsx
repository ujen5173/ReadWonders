"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import WritingHeader from "~/components/sections/writing-header";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

import { FileUploader } from "~/components/ui/file-uploader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Label } from "~/components/ui/label";
import { useUploadFile } from "~/hooks/use-upload-thing";
import CustomEditor from "~/packages/Editor/advanced-editor";
import { defaultEditorContent } from "~/utils/default-content";
import { autosaveContent, loadDraft } from "./utils/database";

export const chapterSchema = z.object({
  content: z.string(),
});

export const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),

  thumbnail: z.string().nullable(),
});

const NewStory = ({
  params,
}: {
  params: {
    chapterId: string;
  };
}) => {
  const { chapterId } = params;

  const { data: chapter } = api.chapter.getSingeChapter.useQuery({
    id: chapterId,
  });

  const [preparingUpload, setPreparingUpload] = useState(false);
  const [imageLoad, setImageLoad] = useState(true);

  const { replace } = useRouter();

  const { uploadFiles, progresses, uploadedFile, isUploading } =
    useUploadFile("imageUploader");
  const [fileData, setFileData] = useState<
    | {
        url: string;
        name: string;
      }
    | undefined
  >(undefined);

  useEffect(() => {
    void (async () => {
      if (uploadedFile) {
        setFileData({
          url: uploadedFile.url,
          name: uploadedFile.name,
        });
        if (chapter) {
          const draftData = await loadDraft(chapter.bookId, chapter.id);

          if (!draftData) return;

          autosaveContent({
            ...draftData,
            cover_image: uploadedFile,
          });
        }
      }
    })();
  }, [uploadedFile]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: defaultEditorContent,
      thumbnail: null,
    },
  });

  useEffect(() => {
    const loadFormData = async () => {
      if (!chapter) return;

      const draft = await loadDraft(chapter?.bookId, chapter?.id);

      if (!draft) return;

      if (draft.cover_image) setFileData(draft.cover_image);

      form.setValue("title", draft.title);
    };

    loadFormData();
  }, [chapter, setFileData]);

  useEffect(() => {
    void (async () => {
      if (!chapter) return;

      const image = await loadDraft(chapter.bookId, chapter.id);
      // const image = window.localStorage.getItem("novel-cover-image");

      if (!image) return;

      if (image.cover_image && !fileData) {
        setFileData(image.cover_image);
      }
    })();
  }, [uploadedFile]);

  const { mutateAsync } = api.chapter.update.useMutation();
  const { mutateAsync: newChapterMutation } = api.chapter.new.useMutation();

  async function onSubmit(type: "PUBLISH" | "NEXT" = "PUBLISH") {
    if (!chapter) return;

    const draftData = await loadDraft(chapter.bookId, chapter.id);

    if (!draftData) return;

    const { content } = draftData;

    if (!content) {
      toast({
        title: "Please write something before publishing.",
      });
    }

    if (!chapter) {
      toast({
        title: "Chapter not found.",
      });

      return;
    }

    const publishedChapter = await mutateAsync({
      title: form.getValues("title"),
      content: JSON.parse(content!),
      thumbnail: uploadedFile?.url ?? null,
      id: chapter?.id,
    });

    if (type) {
      const newChapterId = await newChapterMutation({
        bookId: chapter.bookId,
      });

      if (newChapterId) {
        replace(`/write/s/${newChapterId}`);

        toast({
          title: "Chapter puslished successfully. Redirecting to next chapter",
        });
      }
    }

    if (publishedChapter && type === "PUBLISH") {
      toast({
        title: "Chapter puslished successfully",
      });

      replace(`/works/${chapter.slug}`);
    }
  }

  if (!chapter) {
    return null;
  }

  return (
    <>
      <WritingHeader onSubmit={onSubmit} />

      <section className="w-full">
        <div className="mx-auto max-w-[1140px] px-4 py-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(() => onSubmit("PUBLISH"))}
              className="w-full"
            >
              <div className="mb-5">
                <Label>Cover Image</Label>
                <div className="h-[283px]">
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
                          const draftData = await loadDraft(
                            chapter.bookId,
                            chapter.id,
                          );

                          if (!draftData) return;

                          autosaveContent({
                            ...draftData,
                            title: e.target.value,
                          });
                          // window.localStorage.setItem(
                          //   "novel-title",
                          //   e.target.value,
                          // );
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
                details={{
                  chapterId: chapterId,
                  bookId: chapter?.bookId,
                  title: form.getValues("title"),
                  cover_image:
                    {
                      url: uploadedFile?.url || "",
                      name: uploadedFile?.name || "",
                    } ?? null,
                }}
              />
            </form>
          </Form>
        </div>
      </section>
    </>
  );
};

export default NewStory;
