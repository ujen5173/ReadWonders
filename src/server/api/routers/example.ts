import { z } from "zod";

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
        tags: true,
      },
    });

    const prismatransaction = await ctx.db.$transaction(
      stories.map((story) => {
        return ctx.db.story.update({
          where: {
            id: story.id,
          },
          data: {
            tags: [
              ...(stories.find((s) => s.id === story.id)?.tags ?? []),
              "update",
            ],
          },
        });
      }),
    );

    return {
      stories: prismatransaction,
    };
  }),
});
