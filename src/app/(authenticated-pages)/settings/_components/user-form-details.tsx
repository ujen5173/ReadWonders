"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Spinner } from "~/components/shared/Loading";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { ProfileFileUploader } from "~/components/ui/profile-file-uploader";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/components/ui/use-toast";
import { useUploadFile } from "~/hooks/use-upload-thing";
import { api } from "~/trpc/react";

const formSchema = z.object({
  username: z.string().min(3).max(20),
  name: z.string().min(3).max(50),
  email: z.string().email(),
  bio: z.string().max(500).nullable(),
  profile: z.string().nullable(),
  tagline: z.string().max(100).nullable(),
  website: z.string().url().nullable(),
  twitter: z.string().max(15).nullable(),
  wattpad: z.string().max(50).nullable(),
  goodreads: z.string().url().nullable(),
});

const UserFormDetails = ({
  details,
}: {
  details: z.infer<typeof formSchema> & { id: string };
}) => {
  const { mutate, status, isError, error, isSuccess } =
    api.auth.update.useMutation<z.infer<typeof formSchema>>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: details.username,
      name: details.name,
      email: details.email,
      bio: details.bio ?? null,
      profile: details.profile,
      tagline: details.tagline ?? null,
      website: details.website ?? null,
      twitter: details.twitter ?? null,
      goodreads: details.goodreads ?? null,
      wattpad: details.wattpad ?? null,
    },
  });

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: error?.message,
      });
    } else if (isSuccess) {
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

  useEffect(() => {
    if (uploadedFile) form.setValue("profile", uploadedFile.url);
  }, [uploadedFile]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { profile, ...rest } = values;

    type FormSchemaKey = keyof Omit<z.infer<typeof formSchema>, "profile">;

    const data = (Object.keys(rest) as FormSchemaKey[]).reduce(
      (acc, key) => {
        const value = rest[key];

        if (value === "") {
          acc[key] = null;
        } else {
          acc[key] = value;
        }

        return acc;
      },
      {} as { [K in FormSchemaKey]: string | null },
    );

    const res: z.infer<typeof formSchema> = {
      ...data,
      profile: uploadedFile?.url ?? details.profile ?? null,
    } as z.infer<typeof formSchema>;

    mutate(res);
  };

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
              name="profile"
              render={({ field }) => (
                <FormItem className="h-full w-full gap-2">
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl>
                    <ProfileFileUploader
                      onValueChange={field.onChange}
                      maxSize={5 * 1024 * 1024}
                      progresses={progresses}
                      uploadedFile={
                        uploadedFile
                          ? {
                              url: uploadedFile.url,
                              name: uploadedFile.name,
                            }
                          : {
                              url: details.profile!,
                              name: "profile-picture",
                            }
                      }
                      preparingUpload={preparingUpload}
                      setPreparingUpload={setPreparingUpload}
                      imageLoad={imageLoad}
                      setImageLoad={setImageLoad}
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
              )}
            />
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
                <FormLabel>Tagline</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Turning dreams into stories, one word at a time."
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
                    value={field.value ?? ""}
                    placeholder="A storyteller who weaves magic into words, creating captivating tales that transport readers to other worlds. Whether it's adventure, mystery, or romance, my stories ignite the imagination and leave a lasting impression."
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
                      value={field.value ?? ""}
                      placeholder="example.com"
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
                      value={field.value ?? ""}
                      placeholder="@john5173"
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
                      value={field.value ?? ""}
                      placeholder="john doe"
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
                      value={field.value ?? ""}
                      placeholder="goodreads.com/author/show/john-doe"
                      className="text-base"
                      type="url"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button disabled={status === "pending"} type="submit">
          {status === "pending" ? (
            <Spinner size="sm" className="text-slate-50" />
          ) : null}
          Save
        </Button>
      </form>
    </Form>
  );
};

export default UserFormDetails;
