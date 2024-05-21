import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { type SupabaseUser } from "~/types";

export const authRouter = createTRPCRouter({
  getProfile: privateProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.profiles.findFirstOrThrow({
      where: {
        id: ctx.user.id,
      },
      include: {
        users: {
          select: {
            rawUserMetaData: true,
          },
        },
      },
    });

    return user.users.rawUserMetaData as SupabaseUser | null;
  }),
});
