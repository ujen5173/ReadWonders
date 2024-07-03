import { z } from "zod";
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
            Story: true,
          },
        },
      },
    });

    return genres.map((genre) => {
      const { _count, ...rest } = genre;
      return {
        ...rest,
        stories: _count.Story,
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
          slug: "/" + input.slug,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          Story: {
            take: 10,
            select: {
              id: true,
              description: true,
              slug: true,
              title: true,
              thumbnail: true,
              tags: true,
              isPremium: true,
              category_name: true,
              isMature: true,
              reads: true,
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
          _count: {
            select: {
              Story: true,
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
        stories: _count.Story,
      };
    }),
});
