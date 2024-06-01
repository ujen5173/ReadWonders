"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FileUploader } from "~/components/ui/file-uploader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useUploadFile } from "~/hooks/use-upload-thing";

export const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  content: z.string().min(255, {
    message: "Content must be at least 255 characters.",
  }),
  thumbnail: z.instanceof(File).nullable(),
});

const ChapterArea = () => {
  const [preparingUpload, setPreparingUpload] = useState(false);
  const [imageLoad, setImageLoad] = useState(true);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const { uploadFiles, progresses, uploadedFile, isUploading } =
    useUploadFile("imageUploader");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      title: "",
      thumbnail: null,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({ values });
  }

  return (
    <section className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field }) => (
              <div className="mb-16 w-full space-y-6">
                <FormItem className="h-48 w-full">
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    <FileUploader
                      value={field.value ?? undefined}
                      onValueChange={field.onChange}
                      maxSize={4 * 1024 * 1024}
                      progresses={progresses}
                      uploadedFile={uploadedFile}
                      preparingUpload={preparingUpload}
                      setPreparingUpload={setPreparingUpload}
                      imageLoad={imageLoad}
                      setImageLoad={setImageLoad}
                      // pass the onUpload function here for direct upload
                      onUpload={(e) =>
                        uploadFiles(e, setPreparingUpload, setImageLoad)
                      }
                      disabled={isUploading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            )}
          />

          <FormItem className="w-full">
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input {...form.register("title")} />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem className="w-full">
            <FormControl>
              <Textarea {...form.register("content")} />
            </FormControl>
            <FormMessage />
          </FormItem>
        </form>
      </Form>
    </section>
  );
};

export default ChapterArea;
