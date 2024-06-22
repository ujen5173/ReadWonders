import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  getProfile: privateProcedure.query(async ({ ctx }) => {
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
    .input(z.object({ authorId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const readingLists = await ctx.db.readingList.findMany({
          where: {
            authorId: input.authorId,
          },
          include: {
            stories: {
              select: {
                thumbnail: true,
              },
            },
          },
        });

        return readingLists;
      } catch (err) {
        console.log({ err });
        // throw new Error("Error fetching reading lists");
        return null;
      }
    }),
});
