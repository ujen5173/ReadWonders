"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
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
import { chapterFormSchema } from "~/types/zod";
import { defaultEditorContent } from "~/utils/default-content";
import { getErrorMessage } from "~/utils/handle-errors";
import { autosaveContent, loadDraft } from "~/utils/storage";

const NewStory = ({ params }: { params: { chapterId: string } }) => {
  const { chapterId } = params;

  const { data: chapter } = api.chapter.getSingeChapterById.useQuery(
    {
      chapterId: chapterId,
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const [coverImageHidden, setCoverImageHidden] = useState(false);
  const [preparingUpload, setPreparingUpload] = useState(false);
  const [imageLoad, setImageLoad] = useState(true);
  const [fileData, setFileData] = useState<
    { url: string; name: string } | undefined
  >(undefined);

  const { uploadFiles, progresses, uploadedFile, isUploading } =
    useUploadFile("imageUploader");

  const form = useForm({
    resolver: zodResolver(chapterFormSchema),
    defaultValues: {
      title: "Untitled part",
      content: defaultEditorContent,
      thumbnail: null,
      scheduledAt: null,
      premium: false,
      coins: 0,
    },
  });

  const handleFileUpload = useCallback(async () => {
    if (!uploadedFile || !chapter) return;
    setFileData({ url: uploadedFile.url, name: uploadedFile.name });
    const draftData = await loadDraft(chapter.storyId, chapter.id);

    if (draftData) {
      await autosaveContent({
        draftKey: "cover_image",
        value: { name: uploadedFile.name, url: uploadedFile.url },
        story_id: chapter.storyId,
        chapterId: chapter.id,
      });
    }
  }, [uploadedFile, chapter]);

  useEffect(() => {
    handleFileUpload();
  }, [handleFileUpload]);

  const loadFormData = useCallback(async () => {
    if (!chapter) return;
    const draft = await loadDraft(chapter.storyId, chapter.id);

    if (draft) {
      if (draft.cover_image) setFileData(draft.cover_image);
      if (draft.title) form.setValue("title", draft.title);
    }
  }, [chapter, form]);

  useEffect(() => {
    loadFormData();
  }, [loadFormData]);

  const handleImageLoad = useCallback(async () => {
    if (!chapter) return;
    const draft = await loadDraft(chapter.storyId, chapter.id);

    if (draft?.cover_image && !fileData) setFileData(draft.cover_image);
  }, [chapter, fileData]);

  useEffect(() => {
    handleImageLoad();
  }, [handleImageLoad]);

  const [loading, setLoading] = useState(false);

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

      const res = await mutateAsync({
        title: form.getValues("title"),
        content: JSON.parse(draftData.content),
        thumbnail: uploadedFile?.url ?? null,
        id: chapter.id,
        published: scheduledAt ? false : true,
        isPremium: premium,
        coins,
        scheduledAt,
      });

      toast({ title: "Chapter published successfully" });
      window.location.href = `/chapter/${res.slug}`;
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
          <Button
            onClick={() => setCoverImageHidden((prev) => !prev)}
            variant="secondary"
            size="sm"
            className="mb-4"
          >
            {coverImageHidden ? "Show cover image" : "Hide cover image"}
          </Button>
          <Form {...form}>
            <form onSubmit={undefined} className="w-full">
              {!coverImageHidden && (
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
              )}
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
                      />
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              <CustomEditor
                details={{
                  chapterId,
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

export default NewStory;
