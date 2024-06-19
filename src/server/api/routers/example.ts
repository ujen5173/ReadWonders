import { z } from "zod";
import { images } from "~/data";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  update: publicProcedure.mutation(async ({ ctx }) => {
    const stories = await ctx.db.story.findMany({
      select: {
        id: true,
      },
    });

    const prismatransaction = await ctx.db.$transaction(
      stories.map((story, index) => {
        return ctx.db.story.update({
          where: {
            id: story.id,
          },
          data: {
            thumbnail: images[index],
          },
        });
      }),
    );

    return {
      stories: prismatransaction,
    };
  }),
});
