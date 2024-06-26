import { createTRPCRouter, publicProcedure } from "../trpc";

export const helpersRouter = createTRPCRouter({
  images: publicProcedure.query(async ({ ctx }) => {
    const images = await ctx.db.story.findMany({
      take: 16,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        title: true,
        slug: true,
        thumbnail: true,
      },
    });

    return images;
  }),
});
