import { TRPCError } from "@trpc/server";
import slugify from "slugify";
import { z } from "zod";
import { limit, skip, slugy } from "~/server/constants";
import { authorProcedure, createTRPCRouter, publicProcedure } from "../trpc";

export const bookRouter = createTRPCRouter({
  test: publicProcedure.query(() => {
    return "Book router";
  }),

  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(limit),
      }),
    )
    .query(async ({ ctx, input }) => {
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
          include: {
            chapter: true,
            author: {
              include: {
                author: {
                  select: {
                    rawUserMetaData: true,
                  },
                },
              },
            },
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
        limit: z.number().optional().default(limit),
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

  topPicks: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(limit),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const books = await ctx.db.book.findMany({
          take: input.limit,
          select: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                profile: true,
              },
            },
            reads: true,
            isPremium: true,
            isDeleted: false,
            authorId: false,
            description: true,
            slug: true,
            category: true,
            id: true,
            title: true,
            thumbnail: true,
            isMature: true,
          },

          orderBy: {
            createdAt: "asc",
            reads: "desc",
          },
        });

        return books;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch top picks",
        });
      }
    }),

  featuredStories: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(limit),
        skip: z.number().optional().default(skip),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const books = await ctx.db.book.findMany({
          take: input.limit,
          skip: input.skip,
          select: {
            reads: true,
            isPremium: true,
            description: true,
            tags: true,
            slug: true,
            category: true,
            id: true,
            title: true,
            thumbnail: true,
            isMature: true,
            author: {
              select: {
                name: true,
              },
            },
          },
          where: {
            isDeleted: false,
          },
          orderBy: {
            reads: "desc",
          },
        });

        return books;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch featured stories",
        });
      }
    }),

  latestStories: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(limit),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const books = await ctx.db.book.findMany({
          take: input.limit,
          orderBy: {
            createdAt: "desc",
          },
        });

        return books;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch latest stories",
        });
      }
    }),

  // ----- Mutations -----
  new: authorProcedure
    .input(
      z.object({
        title: z.string().min(2, {
          message: "Title must be at least 2 characters.",
        }),
        description: z.string().min(10, {
          message: "Description must be at least 10 characters.",
        }),
        category: z.string().optional(),
        isMature: z.boolean().default(false),
        isPremium: z.boolean().default(false),
        tags: z.array(z.string()).optional(),
        thumbnail: z.string().min(1).url({
          message: "Thumbnail must be a valid URL",
        }),
      }),
      // formSchema.omit({ thumbnail: true }).extend({
      //   thumbnail: z.string().min(1).url({
      //     message: "Thumbnail must be a valid URL",
      //   }),
      // }),
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
          select: {
            id: true,
          },
        });

        const chapterId = await ctx.db.chapter.create({
          data: {
            bookId: book.id,
          },
          select: {
            id: true,
          },
        });

        return {
          chapterId: chapterId.id,
        };
      } catch (err) {
        console.log({ err });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create book, please try again",
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
