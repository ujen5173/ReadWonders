"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { FileUploader } from "~/components/ui/file-uploader";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { InputTags } from "~/components/ui/input-tags";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/components/ui/use-toast";
import { genres } from "~/data";
import { useUploadFile } from "~/hooks/use-upload-thing";
import { api } from "~/trpc/react";

export const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  category: z.string().optional(),
  isMature: z.boolean().default(false),
  isPremium: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
  thumbnail: z.instanceof(File).nullable(),
});

const WriteBook = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const { uploadFiles, progresses, uploadedFile, isUploading } =
    useUploadFile("imageUploader");
  const { mutateAsync, isLoading, isError, error } = api.book.new.useMutation();

  useEffect(() => {
    if (isError && error) {
      toast({
        type: "background",
        title: error.message,
      });
    }
  }, [error, isError]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      isMature: false,
      isPremium: false,
      tags: [],
      thumbnail: null,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { thumbnail: _, ...rest } = values;

    if (uploadedFile) {
      const res = await mutateAsync({
        ...rest,
        thumbnail: uploadedFile.url,
      });

      if (res.chapterId) {
        replace(`/write/s/${res.chapterId}`);
        toast({
          title: "Book created. Redirecting...",
        });
      }
    }
  }

  const [preparingUpload, setPreparingUpload] = useState(false);
  const [imageLoad, setImageLoad] = useState(true);

  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1140px] px-4 py-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-8"
          >
            <h1 className="text-4xl font-bold">Write a new book</h1>

            <div className="flex w-full flex-col gap-8 md:flex-row lg:gap-16">
              <div className="flex justify-center rounded-lg">
                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <div className="h-[420px] w-[320px] space-y-6">
                      <FormItem className="h-full w-full">
                        <FormLabel>Upload Book Thumbnail</FormLabel>
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
              </div>

              <main className="flex-1">
                <h1 className="mb-6 text-2xl font-bold">Book details</h1>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Untitled Story"
                          {...field}
                          onChange={(event) => {
                            field.onChange(event);
                            const params = new URLSearchParams(searchParams);

                            if (event.target.value) {
                              params.set("title", event.target.value.trim());
                            } else {
                              params.delete("title");
                            }

                            replace(`${pathname}?${params.toString()}`);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        This is your Book name. Name it carefully.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-48" {...field} />
                      </FormControl>
                      <FormDescription>
                        Write a short description that will excite your readers
                        and hook them in.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full bg-white xs:w-4/12">
                            <SelectValue placeholder="Genre" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {genres.map((genre) => (
                              <SelectItem
                                key={genre.name}
                                className="hover:cursor-pointer hover:bg-primary/10"
                                value={genre.name}
                              >
                                {genre.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel>Tag(s)</FormLabel>
                      <FormControl>
                        <InputTags {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isMature"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel>Mature content?</FormLabel>
                      <br />
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isPremium"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel>Premium content?</FormLabel>
                      <br />
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-2">
                  <Button
                    disabled={isUploading}
                    loading={isLoading}
                    type="submit"
                  >
                    Next
                  </Button>
                  {/* <Link href="/write/42342/story/134fdgasg4325t">
                  </Link> */}
                  <Button variant="outline">Save as draft</Button>
                </div>
              </main>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default WriteBook;
