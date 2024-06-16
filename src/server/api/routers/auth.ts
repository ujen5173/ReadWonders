import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { type SupabaseUser } from "~/types";

export const authRouter = createTRPCRouter({
  getProfile: privateProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.profiles.findFirstOrThrow({
      where: {
        id: ctx.user.id,
      },
      include: {
        author: {
          select: {
            rawUserMetaData: true,
          },
        },
      },
    });

    return user.author.rawUserMetaData as SupabaseUser | null;
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
          story: {
            include: {
              chapter: {
                select: {
                  title: true,
                  id: true,
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
});
