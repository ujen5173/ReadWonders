import CharacterCount from "@tiptap/extension-character-count";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";

import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { TRPCError } from "@trpc/server";
import { type JSONContent } from "novel";
import read from "reading-time";
import slugify from "slugify";
import { z } from "zod";
import { limit, slugy } from "~/server/constants";
import { mainSchema } from "~/types/zod";
import { error } from "~/utils/helpers";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";

export const chapterRouter = createTRPCRouter({
  test: publicProcedure.query(() => {
    return "Chapter router";
  }),

  getChapters: publicProcedure
    .input(
      z.object({
        storyId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const chapters = await ctx.db.chapter.findMany({
          where: {
            storyId: input.storyId,
          },
          take: limit,
          select: {
            title: true,
            slug: true,
          },
        });

        return chapters;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch chapters",
        });
      }
    }),

  getSingeChapterById: publicProcedure
    .input(
      z.object({
        chapterId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const chapter = await ctx.db.chapter.findFirst({
          where: { id: input.chapterId },
        });

        if (!chapter) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Chapter not found",
          });
        }

        return chapter;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch chapter",
        });
      }
    }),

  getSingeChapter: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const chapter = await ctx.db.chapter.findFirst({
          where: { slug: input.slug },
          include: {
            story: {
              select: {
                id: true,
                thumbnail: true,
                title: true,
                slug: true,
                love: true,
                reads: true,
                tags: true,
                author: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
                chapters: {
                  orderBy: {
                    createdAt: "asc",
                  },
                  select: {
                    id: true,
                    title: true,
                    slug: true,
                  },
                },
              },
            },
          },
        });

        if (!chapter) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Chapter not found",
          });
        }

        // to get next chapter select next chapter after finding the current chapter
        const nextChapter = chapter.story.chapters.reduce<{
          id: string;
          title: string;
          slug: string;
        } | null>((acc, curr, index) => {
          if (
            acc === null &&
            curr.id === chapter.id &&
            index < chapter.story.chapters.length - 1
          ) {
            return chapter.story.chapters[index + 1] as {
              id: string;
              title: string;
              slug: string;
            };
          }

          return acc;
        }, null);

        const result = {
          ...chapter,
          nextChapter: nextChapter,
        };

        return result;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch chapter",
        });
      }
    }),

  // ----- Mutation -----

  new: privateProcedure
    .input(
      z.object({
        story_id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { story_id, ...rest } = input;
        const chapter = await ctx.db.chapter.create({
          data: {
            ...rest,
            storyId: story_id,
          },
        });

        return chapter.id;
      } catch (err) {
        console.table(error({ err }));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create chapter",
        });
      }
    }),

  changeVisibility: privateProcedure
    .input(
      z.object({
        id: z.string(),
        published: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const res = await ctx.db.chapter.update({
          where: { id: input.id },
          data: {
            published: input.published,
          },
        });

        console.table({ res });

        return true;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to change visibility",
        });
      }
    }),

  update: privateProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        content: mainSchema,
        thumbnail: z.string().nullable(),
        published: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...rest } = input;

        const time = read(
          generateHTML(rest.content as JSONContent, [
            Placeholder,
            Youtube,
            Link,
            Underline,
            Image,
            CharacterCount,
            TextStyle,
            StarterKit,
          ]),
        );

        const story = await ctx.db.chapter.findFirst({
          where: { id: id },
          select: {
            story: {
              select: {
                slug: true,
              },
            },
          },
        });

        const chapter = await ctx.db.chapter.update({
          where: { id: id },
          data: {
            ...rest,
            slug: slugify(rest.title + "-" + story?.story.slug, slugy),
            readingTime: time.minutes,
            content: rest.content as JSONContent,
          },
          select: {
            slug: true,
            id: true,
            storyId: true,
          },
        });

        await ctx.db.story.update({
          where: { id: chapter.storyId },
          data: {
            readingTime: {
              increment: time.minutes,
            },
          },
        });
        console.table("story update completed");

        return { slug: chapter.slug };
      } catch (err) {
        console.table(error({ err }));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update chapter",
        });
      }
    }),

  delete: privateProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.chapter.update({
          where: { id: input.id },
          data: { isDeleted: true },
        });

        return true;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete chapter",
        });
      }
    }),

  read: privateProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const chapter = await ctx.db.chapter.findFirst({
          where: { id: input.id },
          select: {
            storyId: true,
            story: {
              select: {
                authorId: true,
              },
            },
          },
        });

        if (!chapter) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Chapter not found",
          });
        }

        const hasAlreadyRead = await ctx.db.currentReads.findFirst({
          where: {
            userId: ctx.user.id,
          },
          select: {
            stories: {
              select: {
                id: true,
              },
            },
          },
        });

        if (
          hasAlreadyRead?.stories.some((story) => story.id === chapter.storyId)
        ) {
          return true;
        }

        // Only increment reads if the user is not the author
        const shouldIncrement = ctx.user.id !== chapter.story.authorId;

        const [chapterupdate, storyupdate] = await ctx.db.$transaction([
          ctx.db.chapter.update({
            where: { id: input.id },
            data: shouldIncrement ? { reads: { increment: 1 } } : {}, // Increment only if not author
          }),
          ctx.db.story.update({
            where: { id: chapter.storyId },
            data: shouldIncrement ? { reads: { increment: 1 } } : {}, // Increment only if not author
          }),
          ctx.db.currentReads.upsert({
            where: {
              userId: ctx.user.id,
            },
            create: {
              userId: ctx.user.id,
              stories: {
                connect: {
                  id: chapter.storyId,
                },
              },
            },
            update: {
              stories: {
                connect: {
                  id: chapter.storyId,
                },
              },
            },
          }),
        ]);

        if (!chapterupdate || !storyupdate) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update chapter",
          });
        }

        return true;
      } catch (err) {
        console.log(error({ err }));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update chapter",
        });
      }
    }),
});
