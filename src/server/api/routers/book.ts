import { TRPCError } from "@trpc/server";
import slugify from "slugify";
import { z } from "zod";
import { limit, slugy } from "~/server/constants";
import { authorProcedure, createTRPCRouter, publicProcedure } from "../trpc";

export const bookRouter = createTRPCRouter({
  test: publicProcedure.query(() => {
    return "Book router";
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      const books = await ctx.db.book.findMany({
        take: limit,
      });

      return books;
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch books",
      });
    }
  }),

  getSingle: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const book = await ctx.db.book.findUnique({
          where: {
            slug: input.slug,
          },
        });

        if (!book) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Book not found",
          });
        }

        return book;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch book",
        });
      }
    }),

  getMultiple: publicProcedure
    .input(
      z.object({
        slugs: z.array(z.string()),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const books = await ctx.db.book.findMany({
          where: {
            slug: {
              in: input.slugs,
            },
          },
        });

        return books;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch books",
        });
      }
    }),

  // ----- Mutations -----
  new: authorProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        thumbnail: z.string(),
        tags: z.array(z.string()),
        isPremium: z.boolean(),
        audience: z.string(),
        category: z.string(),
        isMature: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = slugify(
          input.title + "-" + Math.random().toString(36).substring(7),
          slugy,
        );

        const book = await ctx.db.book.create({
          data: {
            ...input,
            slug,
            authorId: ctx.user.id,
          },
        });

        return book;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create book",
        });
      }
    }),

  update: authorProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        thumbnail: z.string(),
        tags: z.array(z.string()),
        isPremium: z.boolean(),
        category: z.string(),
        audience: z.string(),
        isMature: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...rest } = input;
        const book = await ctx.db.book.update({
          where: {
            id: id,
          },
          data: rest,
        });

        return book;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update book, please try again",
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
        await ctx.db.book.update({
          where: {
            id: input.id,
          },
          data: {
            isDeleted: true,
          },
        });

        return true;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete book, please try again",
        });
      }
    }),
});
