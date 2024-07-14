import { z } from "zod";
import { TCardSelect } from "~/server/constants/db";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const genreRouter = createTRPCRouter({
  test: publicProcedure.query(() => {
    return "Story router";
  }),

  getGenre: publicProcedure.query(async ({ ctx }) => {
    const genres = await ctx.db.genre.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        _count: {
          select: {
            story: true,
          },
        },
      },
    });

    return genres.map((genre) => {
      const { _count, ...rest } = genre;

      return {
        ...rest,
        stories: _count.story,
      };
    });
  }),

  getSingleGenre: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const genre = await ctx.db.genre.findFirst({
        where: {
          slug: input.slug,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          story: {
            take: 10,
            select: TCardSelect(ctx.user?.id),
          },
          _count: {
            select: {
              story: true,
            },
          },
        },
      });

      if (!genre) {
        return null;
      }

      const { _count, ...rest } = genre;

      return {
        ...rest,
        story: genre.story.map((story) => ({
          ...story,
          readingList: story.readingLists.length > 0,
        })),
        stories: _count.story,
      };
    }),
});
