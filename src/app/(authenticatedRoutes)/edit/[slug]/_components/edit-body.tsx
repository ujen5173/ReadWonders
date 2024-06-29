"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";

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
import { formSchema } from "~/types/zod";

const EditBody = ({
  details,
}: {
  details: {
    id: string;
    title: string;
    description: string;
    category: string | null;
    isMature: boolean;
    isPremium: boolean;
    tags: string[];
    thumbnail: string;
    chapters: {
      id: string;
      title: string | null;
      slug: string | null;
      createdAt: Date;
    }[];
    author: {
      author: {
        rawUserMetaData: Prisma.JsonValue;
      };
    } & {
      id: string;
      username: string | null;
      name: string | null;
      profile: string | null;
      bio: string | null;
      tagline: string | null;
      email: string | null;
      createdAt: Date;
    };
  };
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const { uploadFiles, progresses, uploadedFile, isUploading } =
    useUploadFile("imageUploader");

  const { mutateAsync, isLoading, isError, error } =
    api.story.new.useMutation();

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
      title: details.title,
      description: details.description,
      category: details.category ?? "",
      isMature: details.isMature,
      isPremium: details.isPremium,
      tags: details.tags,
      thumbnail: null,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { thumbnail: _, ...rest } = values;

      if (!details.id) return;

      const res = await mutateAsync({
        ...rest,
        thumbnail: uploadedFile?.url ?? details.thumbnail,
        edit: details.id,
      });

      if (res.newSlug) {
        window.location.href = `/story/${res.newSlug}`;
      } else {
        toast({
          type: "background",
          title: "Something went wrong",
        });
      }
    } catch (error) {
      toast({
        type: "background",
        title: "Something went wrong",
      });
    }
  }

  const [preparingUpload, setPreparingUpload] = useState(false);
  const [imageLoad, setImageLoad] = useState(true);

  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1140px] border-b border-border px-4 py-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-8"
          >
            <h1 className="text-4xl font-bold">Edit Story</h1>

            <div className="flex w-full flex-col gap-8 md:flex-row lg:gap-16">
              <div className="flex justify-center rounded-lg">
                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <div className="h-[420px] w-[320px] space-y-6">
                      <FormItem className="h-full w-full">
                        <FormLabel>Upload Story Thumbnail</FormLabel>
                        <FormControl>
                          <FileUploader
                            value={field.value ?? undefined}
                            onValueChange={field.onChange}
                            maxSize={4 * 1024 * 1024}
                            progresses={progresses}
                            uploadedFile={
                              uploadedFile ?? {
                                url: details.thumbnail,
                                name: "thumbnail",
                              } ??
                              undefined
                            }
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
                          {...field}
                          value={form.getValues("title")}
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
                        <Textarea
                          className="min-h-48"
                          {...field}
                          value={form.getValues("description")}
                        />
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
                          value={form.getValues("category") ?? undefined}
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
                      <div className="flex items-center justify-between pr-2">
                        <FormLabel>Tag(s)</FormLabel>
                        <span className="text-xs font-semibold">Max: 17</span>
                      </div>
                      <FormControl>
                        <InputTags defaultValue={details.tags} {...field} />
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
                          defaultChecked={form.getValues("isMature")}
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
                          defaultChecked={form.getValues("isPremium")}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-2">
                  <Button
                    disabled={isUploading || isLoading}
                    loading={isLoading}
                    type="submit"
                  >
                    Update
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

export default EditBody;
