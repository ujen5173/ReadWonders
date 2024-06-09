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
import { authorProcedure, createTRPCRouter, publicProcedure } from "../trpc";

const JsonContentZod: z.ZodType<unknown> = z.lazy(() =>
  z
    .object({
      type: z.string().optional(),
      attrs: z.record(z.any()).optional(),
      content: z.array(JsonContentZod).optional(), // Recursive structure
      marks: z
        .array(
          z
            .object({
              type: z.string(),
              attrs: z.record(z.any()).optional(),
            })
            .passthrough(),
        )
        .optional(),
      text: z.string().optional(),
    })
    .passthrough(),
);

const mainSchema = z
  .object({
    type: z.string().optional(),
    attrs: z.record(z.any()).optional(),
    content: z.array(JsonContentZod).optional(),
    marks: z
      .array(
        z
          .object({
            type: z.string(),
            attrs: z.record(z.any()).optional(),
          })
          .passthrough(),
      )
      .optional(),
    text: z.string().optional(),
  })
  .passthrough();

export const chapterRouter = createTRPCRouter({
  test: publicProcedure.query(() => {
    return "Chapter router";
  }),

  getChapters: publicProcedure
    .input(
      z.object({
        bookId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const chapters = await ctx.db.chapter.findMany({
          where: {
            bookId: input.bookId,
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

  getSingeChapter: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const chapter = await ctx.db.chapter.findFirst({
          where: { id: input.id },
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

  // ----- Mutation -----

  new: authorProcedure
    .input(
      z.object({
        bookId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const chapter = await ctx.db.chapter.create({
          data: {
            ...input,
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

  update: authorProcedure
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

  delete: authorProcedure
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
