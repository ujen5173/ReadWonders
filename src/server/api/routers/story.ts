import { TRPCError } from "@trpc/server";
import slugify from "slugify";
import { z } from "zod";
import { limit, skip, slugy } from "~/server/constants";
import {
  authorProcedure,
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "../trpc";

export const storyRouter = createTRPCRouter({
  test: publicProcedure.query(() => {
    return "Story router";
  }),

  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().default(limit),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const stories = await ctx.db.story.findMany({
          take: input.limit,
          include: {
            chapter: {
              select: {
                title: true,
                id: true,
                createdAt: true,
                slug: true,
              },
            },
            author: {
              select: {
                name: true,
                profile: true,
              },
            },
          },
        });

        console.log({ stories });

        return stories;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch stories",
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
        const story = await ctx.db.story.findUnique({
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

        if (!story) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Story not found",
          });
        }

        return story;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch story",
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
        const stories = await ctx.db.story.findMany({
          where: {
            slug: {
              in: input.slugs,
            },
          },
        });

        return stories;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch stories",
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
        const stories = await ctx.db.story.findMany({
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

        return stories;
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
        console.log({ input });

        const stories = await ctx.db.story.findMany({
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
            chapter: {
              select: {
                title: true,
                id: true,
                createdAt: true,
                slug: true,
              },
            },
            author: {
              select: {
                name: true,
                profile: true,
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

        return stories;
      } catch (err) {
        console.log({ err });
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
        const stories = await ctx.db.story.findMany({
          take: input.limit,
          orderBy: {
            createdAt: "desc",
          },
        });

        return stories;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch latest stories",
        });
      }
    }),

  work: privateProcedure.query(async ({ ctx }) => {
    try {
      const stories = await ctx.db.story.findMany({
        where: {
          authorId: ctx.user.id,
        },
        take: limit,
        skip,
      });

      return stories;
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch stories",
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

        const story = await ctx.db.story.create({
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
            storyId: story.id,
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
          message: "Failed to create story, please try again",
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
        const story = await ctx.db.story.update({
          where: {
            id: id,
          },
          data: rest,
        });

        return story;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update story, please try again",
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
        await ctx.db.story.update({
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
          message: "Failed to delete story, please try again",
        });
      }
    }),

  addToReadingList: privateProcedure
    .input(
      z.object({
        readingListId: z.string(),
        storyId: z.string(),
        newListTitle: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const exisitingReadingList = await ctx.db.readingList.findFirst({
          where: {
            id: input.readingListId,
          },
          select: {
            id: true,
          },
        });

        if (!exisitingReadingList) {
          await ctx.db.readingList.create({
            data: {
              title: input.newListTitle ?? "New Reading lists",
              stories: {
                connect: {
                  id: input.storyId,
                },
              },
              id: input.readingListId,
              authorId: ctx.user.id,
            },
          });
        } else {
          await ctx.db.readingList.update({
            where: {
              id: input.readingListId,
            },
            data: {
              stories: {
                connect: {
                  id: input.storyId,
                },
              },
            },
          });
        }

        return true;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add story to reading list",
        });
      }
    }),
});
