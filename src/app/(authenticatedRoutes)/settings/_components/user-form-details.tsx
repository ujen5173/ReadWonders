"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
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
import { toast } from "~/components/ui/use-toast";
import { useUploadFile } from "~/hooks/use-upload-thing";
import { api } from "~/trpc/react";

const formSchema = z.object({
  username: z.string().min(3).max(20),
  name: z.string().min(3).max(50),
  email: z.string().email(),
  bio: z.string(),
  profile: z.instanceof(File).nullable(),
  tagline: z.string(),
  website: z.string().url().optional().nullable(),
  twitter: z.string().optional().nullable(),
  wattpad: z.string().optional().nullable(),
  goodreads: z.string().url().optional().nullable(),
});

const UserFormDetails = ({
  details,
}: {
  details: {
    id: string;
    username: string;
    name: string;
    email: string;
    bio: string | null;
    profile: string | null;
    tagline: string | null;
    website: string | null;
    twitter: string | null;
    wattpad: string | null;
    goodreads: string | null;
  };
}) => {
  const { mutate, isLoading, isError, error, isSuccess } =
    api.auth.update.useMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: details.username,
      name: details.name,
      email: details.email,
      bio: details.bio ?? "",
      profile: null,
      tagline: details.tagline ?? "",
      website: details.website ?? "",
      twitter: details.twitter ?? "",
    },
  });

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: error?.message,
      });
    }

    if (isSuccess) {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    }
  }, [isError, error, isSuccess]);

  const { uploadFiles, progresses, uploadedFile, isUploading } =
    useUploadFile("imageUploader");

  const [preparingUpload, setPreparingUpload] = useState(false);
  const [imageLoad, setImageLoad] = useState(true);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { profile, ...rest } = values;

    mutate({
      ...rest,
      profile: uploadedFile?.url ?? details.profile,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-4 space-y-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="john doe"
                      value={form.getValues("name")}
                      className="text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="john5173"
                      value={form.getValues("username")}
                      className="text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="">
              <FormField
                control={form.control}
                name="profile"
                render={({ field }) => (
                  <div className="space-y-6">
                    <FormItem className="h-full w-full gap-2">
                      <FormLabel>Profile Picture</FormLabel>
                      <FormControl>
                        <FileUploader
                          value={field.value ?? undefined}
                          onValueChange={field.onChange}
                          maxSize={5 * 1024 * 1024}
                          progresses={progresses}
                          uploadedFile={
                            uploadedFile ?? details.profile
                              ? {
                                  url: details.profile as string,
                                  name: "profile picture",
                                }
                              : undefined ?? undefined
                          }
                          preparingUpload={preparingUpload}
                          setPreparingUpload={setPreparingUpload}
                          imageLoad={imageLoad}
                          setImageLoad={setImageLoad}
                          // pass the onUpload function here for direct upload
                          onUpload={(e) =>
                            uploadFiles(e, setPreparingUpload, setImageLoad)
                          }
                          style={{
                            height: "70px",
                            width: "70px",
                            borderRadius: "50%",
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
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="john@storyteller.com"
                      value={form.getValues("email")}
                      className="text-base"
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="tagline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tagling</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Turning dreams into stories, one word at a time."
                    value={form.getValues("tagline")}
                    className="text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="A storyteller who weaves magic into words, creating captivating tales that transport readers to other worlds. Whether it's adventure, mystery, or romance, my stories ignite the imagination and leave a lasting impression."
                    value={form.getValues("bio")}
                    className="text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="example.com"
                      value={form.getValues("website") ?? ""}
                      className="text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter / X username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="@john5173"
                      value={form.getValues("twitter") ?? ""}
                      className="text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <FormField
              control={form.control}
              name="wattpad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wattpad</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="ujen5173"
                      value={form.getValues("wattpad") ?? ""}
                      className="text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="goodreads"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>goodReads</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="goodreads.com/author/show/john-doe"
                      value={form.getValues("goodreads") ?? ""}
                      className="text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button loading={isLoading} disabled={isLoading} type="submit">
          Save
        </Button>
      </form>
    </Form>
  );
};

export default UserFormDetails;
