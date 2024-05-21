import { TRPCError } from "@trpc/server";
import read from "reading-time";
import slugify from "slugify";
import { z } from "zod";
import { limit, slugy } from "~/server/constants";
import { authorProcedure, createTRPCRouter, publicProcedure } from "../trpc";

export const bookRouter = createTRPCRouter({
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
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const chapter = await ctx.db.chapter.findUnique({
          where: { slug: input.slug },
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
        title: z.string(),
        content: z.string(),
        thumbnail: z.string(),
        bookId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = slugify(
          input.title + "-" + Math.random().toString(36).substring(7),
          slugy,
        );
        const time = read(input.content);
        const chapter = await ctx.db.chapter.create({
          data: {
            ...input,
            slug,
            time: time.minutes,
          },
        });

        return chapter;
      } catch (err) {
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
        content: z.string(),
        thumbnail: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const time = read(input.content);
        const chapter = await ctx.db.chapter.update({
          where: { id: input.id },
          data: {
            ...input,
            time: time.minutes,
          },
        });

        return chapter;
      } catch (err) {
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
