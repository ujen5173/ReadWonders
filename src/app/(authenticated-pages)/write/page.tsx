"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { Spinner } from "~/components/shared/Loading";

import { Button, buttonVariants } from "~/components/ui/button";
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
import { useUploadFile } from "~/hooks/use-upload-thing";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { formSchema } from "~/types/zod";

const WriteStory = () => {
  const router = useRouter();

  const { uploadFiles, progresses, uploadedFile, isUploading } =
    useUploadFile("imageUploader");
  const { mutateAsync, status, isError, error } = api.story.new.useMutation();
  const { data: genreDetails, isLoading } = api.genre.getGenre.useQuery({
    limit: 10,
  });

  useEffect(() => {
    if (isError && error) {
      toast({
        title: error.message,
      });
    }
  }, [error, isError]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryName: "",
      isMature: false,
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

      if (res.slug) {
        void router.replace(`/write/s/${res.slug}`);
        toast({
          title: "Story created. Redirecting...",
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
            <h1 className="text-4xl font-bold">Write a new story</h1>

            <div className="flex w-full flex-col gap-8 md:flex-row lg:gap-16">
              <div className="flex justify-center rounded-lg">
                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <div className="h-[460px] w-[320px] space-y-6">
                      <FormItem className="h-full w-full">
                        <FormLabel>Upload Story Thumbnail</FormLabel>
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
                            onUpload={async (e) => {
                              await uploadFiles(
                                e,
                                setPreparingUpload,
                                setImageLoad,
                              );
                            }}
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
                <h1 className="mb-6 text-2xl font-bold">Story details</h1>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Untitled Story"
                          className="text-base"
                          autoFocus
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is your Story name. Name it carefully.
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
                        <Textarea className="min-h-48 text-base" {...field} />
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
                  name="categoryName"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel>Category Name</FormLabel>
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
                            {isLoading ? (
                              <div className="px-4 py-2 hover:cursor-pointer hover:bg-primary/10">
                                Loading...
                              </div>
                            ) : (genreDetails ?? []).length > 0 ? (
                              genreDetails?.map((genre) => (
                                <SelectItem
                                  key={genre.name}
                                  className="hover:cursor-pointer hover:bg-primary/10"
                                  value={genre.name}
                                >
                                  {genre.name}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="px-4 py-2 hover:cursor-pointer hover:bg-primary/10">
                                No genres found
                              </div>
                            )}
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
                      <div className="flex items-center justify-between pr-2">
                        <FormLabel>Tag(s)</FormLabel>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              (form.getValues("tags") ?? []).length < 17
                                ? "text-slate-800"
                                : "text-red-600",
                              "text-xs font-semibold",
                            )}
                          >
                            Max: 17
                          </span>
                        </div>
                      </div>
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

                <div className="flex items-center gap-2">
                  <Link href="/" legacyBehavior>
                    <a className={buttonVariants({ variant: "secondary" })}>
                      Cancel
                    </a>
                  </Link>
                  <Button
                    disabled={isUploading || status === "pending"}
                    type="submit"
                  >
                    {status === "pending" && (
                      <Spinner className="h-5 w-5 text-slate-50" />
                    )}
                    Next
                  </Button>
                </div>
              </main>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default WriteStory;
