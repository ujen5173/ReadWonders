import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { limit } from "~/server/constants";
import { TCardSelect } from "~/server/constants/db";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const genreRouter = createTRPCRouter({
  test: publicProcedure.query(() => {
    return "Story router";
  }),

  getGenre: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(limit),
      }),
    )
    .query(async ({ input, ctx }) => {
      const genres = await ctx.db.genre.findMany({
        take: input.limit,
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
      try {
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
              select: TCardSelect(ctx?.session?.user?.id),
            },
            _count: {
              select: {
                story: true,
              },
            },
          },
        });

        if (!genre) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message:
              "Well, Well... Looks like this Genre hasn't been Invented yet",
          });
        }

        const { _count, ...rest } = genre;

        return {
          ...rest,
          story: genre.story.map((story) => ({
            ...story,
            readingList: (story.readingLists ?? []).length > 0,
          })),
          stories: _count.story,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new Error("An error occurred while fetching genre.");
      }
    }),
});
