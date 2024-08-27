"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type Prisma } from "@prisma/client";
import { type JSONContent } from "novel";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { getErrorMessage } from "~/lib/handle-errors";
import CustomEditor from "~/packages/Editor/advanced-editor";
import { api } from "~/trpc/react";
import { chapterFormSchema } from "~/types/zod";
import WritingHeader from "../../_components/writing-header";

const ChapterForm = ({
  chapterDetails,
}: {
  chapterDetails: {
    // slug: string | null;
    id: string;
    title: string;
    content: Prisma.JsonValue;
    isPremium: boolean;
    scheduledAt: Date | null;
    thumbnail: string | null;
    published: boolean;
    price: number;
  };
}) => {
  const { id, ...rest } = chapterDetails;
  const [coverImageHidden, setCoverImageHidden] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preparingUpload, setPreparingUpload] = useState(false);
  const [imageLoad, setImageLoad] = useState(true);
  const { uploadFiles, progresses, uploadedFile, isUploading } =
    useUploadFile("imageUploader");

  const form = useForm({
    resolver: zodResolver(chapterFormSchema),
    defaultValues: rest,
    // defaultValues: {
    //    title: chapterDetails.title ?? "Untitled part",
    //    slug: chapterDetails.slug ?? "untitled-part" + Math.random().toString(36).substring(7),
    //    content: chapterDetails.content,
    //    isPremium: chapterDetails.isPremium,
    //    price: chapterDetails.price,
    //    published: chapterDetails.published,
    //    scheduledAt : chapterDetails.scheduledAt,
    // },
  });

  const handleEditorUpdate = (content: JSONContent) => {
    form.setValue("content", content);
  };

  const { mutateAsync: updateChapter } = api.chapter.update.useMutation();

  const onSubmit = async (
    premium: boolean,
    price: number,
    scheduledAt: Date | undefined,
  ) => {
    try {
      setLoading(true);
      const chapterData = {
        title: form.getValues("title"),
        content: form.getValues("content"),
        thumbnail: uploadedFile?.url ?? form.getValues("thumbnail"),
        published: !scheduledAt,
        isPremium: premium,
        price,
        scheduledAt,
      };

      const res = await updateChapter({
        ...chapterData,
        id,
      });

      toast({
        title: `Chapter Updated successfully.`,
      });
      window.location.href = `/chapter/${res.slug}`;
    } catch (err) {
      toast({ title: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

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
            <form className="w-full">
              {!coverImageHidden && (
                <div className="mb-5">
                  <Label>Cover Image</Label>
                  <div className="h-[360px]">
                    <FileUploader
                      progresses={progresses}
                      maxSize={4 * 1024 * 1024}
                      uploadedFile={uploadedFile}
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
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                        className="w-full border-b border-border bg-transparent py-4 text-center text-3xl font-semibold outline-none"
                      />
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              <CustomEditor
                handleEditorUpdate={handleEditorUpdate}
                defaultContent={
                  (chapterDetails.content as JSONContent | null) ?? undefined
                }
              />
            </form>
          </Form>
        </div>
      </section>
    </>
  );
};

export default ChapterForm;
