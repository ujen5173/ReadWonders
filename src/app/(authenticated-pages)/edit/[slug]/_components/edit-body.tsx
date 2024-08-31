"use client";

import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { zodResolver } from "@hookform/resolvers/zod";
import { Add01Icon } from "hugeicons-react";
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
import { useUploadFile } from "~/hooks/use-upload-thing";
import { api } from "~/trpc/react";
import { formUpdateSchema } from "~/types/zod";

import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import { Spinner } from "~/components/shared/Loading";
import { getErrorMessage } from "~/lib/handle-errors";
import { type ChapterCardWithPublish } from "~/types";
import EditChapterDragItem from "./chapter-drag-item";

const EditBody = ({
  details,
}: {
  details: {
    id: string;
    title: string;
    slug: string;
    description: string;
    categoryName: string | null;
    isMature: boolean;
    tags: string[];
    thumbnail: string;
    published: boolean;
    chapters: ChapterCardWithPublish[];
  };
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const { id, slug, chapters, ...rest } = details;

  const {
    mutateAsync: newChapterMutate,
    status: newChapterLoading,
    isError: isNewChapterError,
    error: newChapterError,
  } = api.chapter.new.useMutation();

  const { data: genreDetails, isLoading } = api.genre.getGenre.useQuery({
    limit: 10,
  });

  const { uploadFiles, progresses, uploadedFile, isUploading } =
    useUploadFile("imageUploader");

  const { mutateAsync, status, isError, error } = api.story.new.useMutation();

  useEffect(() => {
    if (isNewChapterError && newChapterError) {
      toast({
        title: newChapterError.message,
      });
    }
  }, [newChapterError, isNewChapterError]);

  useEffect(() => {
    if (isError && error) {
      toast({
        title: error.message,
      });
    }
  }, [error, isError]);

  const form = useForm<z.infer<typeof formUpdateSchema>>({
    resolver: zodResolver(formUpdateSchema),
    defaultValues: rest,
  });

  async function onSubmit(values: z.infer<typeof formUpdateSchema>) {
    try {
      const { thumbnail: _, ...rest } = values;

      if (!id) return;

      const res = await mutateAsync({
        ...rest,
        thumbnail: uploadedFile?.url ?? details.thumbnail,
        edit: id,
        categoryName: values.categoryName ?? undefined,
      });

      if (res.slug) {
        window.location.href = `/story/${res.slug}`;
      } else {
        toast({
          type: "background",
          title: "Something went wrong",
        });
      }
    } catch (err) {
      toast({
        type: "background",
        title: "Something went wrong",
      });
    }
  }

  const [preparingUpload, setPreparingUpload] = useState(false);
  const [imageLoad, setImageLoad] = useState(true);

  // DND
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [chs, setChs] = useState(details.chapters.sort((a, b) => a.sn - b.sn));
  const [hasDraged, setHasDraged] = useState(false);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setHasDraged(true);

    if (over && active.id !== over.id) {
      setChs((prevItems) => {
        const oldIndex = prevItems.findIndex((item) => item.id === active.id);
        const newIndex = prevItems.findIndex((item) => item.id === over.id);

        const updatedItems = arrayMove(prevItems, oldIndex, newIndex);

        // Update the sn for all items based on their new positions
        return updatedItems.map((item, index) => ({
          ...item,
          sn: index,
        }));
      });
    }
  }

  const {
    mutate: chapterIndexMutation,
    status: chapterIndexLoading,
    isError: isChapterIndexError,
    error: chapterIndexError,
    isSuccess,
  } = api.chapter.updateChapterIndex.useMutation();

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Chapters order updated successfully",
      });
    }

    if (isChapterIndexError) {
      toast({
        title: getErrorMessage(chapterIndexError),
      });
    }
  }, [isSuccess, isChapterIndexError, chapterIndexError]);

  function handleChapterIndexChange() {
    const chapters = chs.map((ch) => ({
      id: ch.id,
      sn: ch.sn,
    }));

    chapterIndexMutation(chapters);
  }

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
                  render={() => (
                    <div className="h-[420px] w-[320px] space-y-6">
                      <FormItem className="h-full w-full">
                        <FormLabel>Upload Story Thumbnail</FormLabel>
                        <FormControl>
                          <FileUploader
                            value={undefined}
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

                            router.replace(`${pathname}?${params.toString()}`);
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
                  name="categoryName"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel>CategoryName</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          onValueChange={field.onChange}
                          defaultValue={field.value ?? undefined}
                          value={form.getValues("categoryName") ?? undefined}
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

                <div className="mb-4 flex items-center gap-2">
                  <Button
                    disabled={isUploading || status === "pending"}
                    type="submit"
                  >
                    {status === "pending" && (
                      <Spinner className="size-5 text-slate-50" size="sm" />
                    )}
                    Update
                  </Button>
                </div>

                <div className="mb-6 border-t border-border pt-3">
                  <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Chapters</h1>
                    <Button
                      onClick={async () => {
                        const res = await newChapterMutate({
                          story_id: details.id,
                        });

                        if (res) {
                          toast({
                            title: "New Chapter Created",
                          });
                          router.push(`/write/s/${res}`);
                        }
                      }}
                      type="button"
                      disabled={newChapterLoading === "pending"}
                      className="text-xs"
                      size="sm"
                    >
                      {newChapterLoading === "pending" ? (
                        <Spinner className="size-5 text-slate-50" size="sm" />
                      ) : (
                        <Add01Icon className="size-3 stroke-[3]" />
                      )}
                      New Chapter
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        modifiers={[
                          restrictToVerticalAxis,
                          restrictToParentElement,
                        ]}
                      >
                        <SortableContext
                          items={chs}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-2">
                            {chs.map((item) => (
                              <EditChapterDragItem key={item.id} item={item} />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    </div>
                    <Button
                      type="button"
                      onClick={handleChapterIndexChange}
                      disabled={!hasDraged || chapterIndexLoading === "pending"}
                      variant="secondary"
                    >
                      {chapterIndexLoading === "pending" && (
                        <Spinner className="size-5 text-slate-50" size="sm" />
                      )}
                      Save Chapter Order
                    </Button>
                  </div>
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
