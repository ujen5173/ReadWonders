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
            story_id: input.storyId,
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
                author: {
                  select: {
                    username: true,
                  },
                },
                chapters: {
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
            story_id: story_id,
          },
        });

        return chapter.id;
      } catch (err) {
        console.log({ err });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create chapter",
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

        const chapter = await ctx.db.chapter.update({
          where: { id: id },
          data: {
            ...rest,
            slug: slugify(input.title, slugy),
            time: time.minutes,
            content: rest.content as JSONContent,
          },
          select: {
            slug: true,
          },
        });

        return chapter;
      } catch (err) {
        console.log({ err });
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
});
