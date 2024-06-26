"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { formSchema } from "~/types/zod";
import { defaultEditorContent } from "~/utils/default-content";
import { autosaveContent, loadDraft } from "./utils/database";

const NewStory = ({ params }: { params: { chapterId: string } }) => {
  const { chapterId } = params;
  const router = useRouter();
  const { replace } = router;

  const { data: chapter } = api.chapter.getSingeChapterById.useQuery(
    {
      chapterId: chapterId,
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const [preparingUpload, setPreparingUpload] = useState(false);
  const [imageLoad, setImageLoad] = useState(true);
  const [fileData, setFileData] = useState<
    { url: string; name: string } | undefined
  >(undefined);

  const { uploadFiles, progresses, uploadedFile, isUploading } =
    useUploadFile("imageUploader");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: defaultEditorContent,
      thumbnail: null,
    },
  });

  const handleFileUpload = useCallback(async () => {
    if (!uploadedFile || !chapter) return;
    setFileData({ url: uploadedFile.url, name: uploadedFile.name });
    const draftData = await loadDraft(chapter.story_id, chapter.id);

    if (draftData) {
      await autosaveContent({
        draftKey: "cover_image",
        value: { name: uploadedFile.name, url: uploadedFile.url },
        story_id: chapter.story_id,
        chapterId: chapter.id,
      });
    }
  }, [uploadedFile, chapter]);

  useEffect(() => {
    handleFileUpload();
  }, [handleFileUpload]);

  const loadFormData = useCallback(async () => {
    if (!chapter) return;
    const draft = await loadDraft(chapter.story_id, chapter.id);

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
    const draft = await loadDraft(chapter.story_id, chapter.id);

    if (draft?.cover_image && !fileData) setFileData(draft.cover_image);
  }, [chapter, fileData]);

  useEffect(() => {
    handleImageLoad();
  }, [handleImageLoad]);

  const { mutateAsync, isLoading: uploadingChapter } =
    api.chapter.update.useMutation();
  const { mutateAsync: newChapterMutation, isLoading: nextChapterLoading } =
    api.chapter.new.useMutation();

  const onSubmit = async (type: "PUBLISH" | "NEXT" = "PUBLISH") => {
    if (!chapter) {
      toast({ title: "Chapter not found." });

      return;
    }

    const draftData = await loadDraft(chapter.story_id, chapter.id);
    console.log(draftData);

    if (!draftData?.content) {
      toast({ title: "Please write something before publishing." });

      return;
    }

    const publishedChapter = await mutateAsync({
      title: form.getValues("title"),
      content: JSON.parse(draftData.content),
      thumbnail: uploadedFile?.url ?? null,
      id: chapter.id,
    });

    if (type === "NEXT") {
      const newChapterId = await newChapterMutation({
        story_id: chapter.story_id,
      });

      if (newChapterId) {
        replace(`/write/s/${newChapterId}`);
        toast({
          title: "Chapter published successfully. Redirecting to next chapter",
        });
      }
    } else {
      toast({ title: "Chapter published successfully" });
      replace(`/works`);
    }
  };

  const debouncedUpdates = useDebouncedCallback(async (e: string) => {
    if (chapter) {
      autosaveContent({
        draftKey: "title",
        value: e,
        story_id: chapter.story_id,
        chapterId: chapter.id,
      });
    }
  }, 1500);

  // if (!chapter) {
  //   return null;
  // }

  return (
    <>
      <WritingHeader
        uploadingChapter={uploadingChapter}
        nextChapterLoading={nextChapterLoading}
        onSubmit={onSubmit}
      />

      <section className="w-full">
        <div className="mx-auto max-w-[1140px] px-4 py-8">
          <Button variant="secondary" size="sm" className="mb-4">
            Enter Writing Mode
          </Button>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(() => onSubmit("PUBLISH"))}
              className="w-full"
            >
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
                details={{
                  chapterId,
                  story_id: chapter?.story_id ?? "",
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
