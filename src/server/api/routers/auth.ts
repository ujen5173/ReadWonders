import slugify from "slugify";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { limit, slugy } from "~/server/constants";

export const authRouter = createTRPCRouter({
  authInfo: publicProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),

  getProfile: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return null;

    const user = await ctx.db.profiles.findFirstOrThrow({
      where: {
        id: ctx.user.id,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        profile: true,
      },
    });

    return user;
  }),

  userProfile: publicProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userDetails = await ctx.db.profiles.findFirst({
        where: {
          username: input.username,
        },
        include: {
          stories: {
            take: limit,
            include: {
              chapters: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  createdAt: true,
                },
              },
              author: {
                select: {
                  name: true,
                  username: true,
                  profile: true,
                },
              },
            },
          },
        },
      });

      return userDetails;
    }),

  readingLists: publicProcedure
    .input(
      z.object({
        limit: z.number().default(6),
        authorId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const readingLists = await ctx.db.readingList.findMany({
          take: input.limit,
          where: {
            authorId: input.authorId,
          },
          select: {
            id: true,
            authorId: false,
            title: true,
            slug: true,
            description: true,
            private: false,
            createdAt: false,
            stories: {
              take: 3,
              select: {
                thumbnail: true,
              },
            },
          },
        });

        return readingLists;
      } catch (err) {
        throw new Error("Error fetching reading lists");
      }
    }),

  deleteReadingList: privateProcedure
    .input(
      z.object({
        readingListId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.readingList.delete({
          where: {
            id: input.readingListId,
          },
        });

        return true;
      } catch (err) {
        throw new Error("Error deleting reading list");
      }
    }),

  editReadingList: privateProcedure
    .input(
      z.object({
        readingListId: z.string(),
        title: z.string(),
        description: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const newSlug = slugify(input.title, slugy);

        await ctx.db.readingList.update({
          where: {
            id: input.readingListId,
          },
          data: {
            title: input.title,
            slug: newSlug,
            description: input.description,
          },
        });

        return true;
      } catch (err) {
        throw new Error("Error deleting reading list");
      }
    }),
});
