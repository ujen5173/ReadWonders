import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import slugify from "slugify";
import { z } from "zod";
import { limit, skip, slugy } from "~/server/constants";
import { TCard } from "~/types";
import {
  authorProcedure,
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "../trpc";

export const storyRouter = createTRPCRouter({
  test: publicProcedure.query(() => {
    return "Story router";
  }),

  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().default(limit),
        skip: z.number().default(skip),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const stories = await ctx.db.story.findMany({
          take: input.limit,
          skip: input.skip,
          include: {
            chapters: {
              select: {
                title: true,
                id: true,
                createdAt: true,
                slug: true,
              },
            },
            author: {
              select: {
                name: true,
                profile: true,
              },
            },
          },
        });

        return stories;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch stories",
        });
      }
    }),

  fromGenre: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        limit: z.number().default(limit),
        skip: z.number().default(skip),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const stories = await ctx.db.story.findMany({
          take: input.limit,
          skip: input.skip,
          where: {
            category: {
              equals: input.slug,
              mode: "insensitive",
            },
          },
          include: {
            chapters: {
              select: {
                title: true,
                id: true,
                createdAt: true,
                slug: true,
              },
            },
            author: {
              select: {
                name: true,
                profile: true,
              },
            },
          },
        });

        return stories;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch stories",
        });
      }
    }),

  getSingle: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const story = await ctx.db.story.findUnique({
          where: {
            slug: input.slug,
          },
          include: {
            chapters: true,
            author: {
              include: {
                author: {
                  select: {
                    rawUserMetaData: true,
                  },
                },
              },
            },
          },
        });

        if (!story) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Story not found",
          });
        }

        return story;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch story",
        });
      }
    }),

  getReadingList: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const readingList = await ctx.db.readingList.findFirst({
          where: {
            slug: input.slug,
          },
          select: {
            id: true,
            title: true,
            author: {
              select: {
                name: true,
                bio: true,
                profile: true,
              },
            },
            stories: {
              select: {
                id: true,
                description: true,
                slug: true,
                title: true,
                thumbnail: true,
                tags: true,
                is_premium: true,
                category: true,
                is_mature: true,
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
                    profile: true,
                  },
                },
              },
            },
          },
        });

        if (!readingList) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Reading list not found",
          });
        }

        return readingList;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch reading list",
        });
      }
    }),

  getMultiple: publicProcedure
    .input(
      z.object({
        slugs: z.array(z.string()),
        limit: z.number().optional().default(limit),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const stories = await ctx.db.story.findMany({
          where: {
            slug: {
              in: input.slugs,
            },
          },
        });

        return stories;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch stories",
        });
      }
    }),

  topPicks: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(limit),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const stories = await ctx.db.story.findMany({
          take: input.limit,
          select: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                profile: true,
              },
            },
            reads: true,
            is_premium: true,
            is_deleted: false,
            author_id: false,
            description: true,
            slug: true,
            category: true,
            id: true,
            title: true,
            thumbnail: true,
            is_mature: true,
          },

          orderBy: {
            createdAt: "asc",
            reads: "desc",
          },
        });

        return stories;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch top picks",
        });
      }
    }),

  featuredStories: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(limit),
        skip: z.number().optional().default(skip),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const stories = await ctx.db.story.findMany({
          take: input.limit,
          skip: input.skip,
          select: {
            reads: true,
            is_premium: true,
            description: true,
            tags: true,
            slug: true,
            category: true,
            id: true,
            title: true,
            thumbnail: true,
            is_mature: true,
            chapters: {
              select: {
                title: true,
                id: true,
                createdAt: true,
                slug: true,
              },
            },
            author: {
              select: {
                name: true,
                profile: true,
              },
            },
          },
          where: {
            is_deleted: false,
          },
          orderBy: {
            reads: "desc",
          },
        });

        return stories;
      } catch (err) {
        console.log({ err });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch featured stories",
        });
      }
    }),

  latestStories: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(limit),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const stories = await ctx.db.story.findMany({
          take: input.limit,
          orderBy: {
            createdAt: "desc",
          },
        });

        return stories;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch latest stories",
        });
      }
    }),

  work: privateProcedure.query(async ({ ctx }) => {
    try {
      const stories = await ctx.db.story.findMany({
        where: {
          author_id: ctx.user.id,
        },
        take: limit,
        skip,
      });

      return stories;
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch stories",
      });
    }
  }),

  search: publicProcedure
    .input(
      z.object({
        query: z.string(),
        limit: z.number().optional().default(limit),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { query, cursor } = input;

        const searchTerms = query.toLowerCase().split(/\s+/);

        const searchConditions = searchTerms.map(
          (term) => Prisma.sql`
            (
              LOWER(story.title) LIKE ${`%${term}%`} OR
              LOWER(story.slug) LIKE ${`%${term}%`} OR
              LOWER(story.description) LIKE ${`%${term}%`} OR
              LOWER(ARRAY_TO_STRING(story.tags, ' ')) LIKE ${`%${term}%`} OR
              EXISTS (
                SELECT 1 FROM chapter
                WHERE chapter.story_id = story.id AND LOWER(chapter.title) LIKE ${`%${term}%`}
              )
            )
          `,
        );

        const cursorCondition = cursor
          ? Prisma.sql`AND story.id::text > ${cursor}`
          : Prisma.empty;

        const stories = await ctx.db.$queryRaw<TCard[]>`
          SELECT
            story.id,
            story.description,
            story.slug,
            story.title,
            story.thumbnail,
            story.tags,
            story.is_premium,
            story.category,
            story.is_mature,
            story.reads,
            COALESCE(json_agg(
                json_build_object(
                  'id', chapter.id,
                  'title', chapter.title,
                  'slug', chapter.slug,
                  'createdAt', chapter."createdAt"
                )
              ) FILTER (WHERE chapter.id IS NOT NULL), '[]') AS chapters,
            json_build_object(
              'name', author.name,
              'profile', author.profile
            ) AS author
          FROM story
          LEFT JOIN chapter ON chapter.story_id = story.id
          LEFT JOIN profiles AS author ON author.id = story.author_id
          WHERE ${Prisma.join(searchConditions, " AND ")} ${cursorCondition}
          GROUP BY story.id, author.name, author.profile
          ORDER BY story.id
          LIMIT ${input.limit + 1}
        `;

        const hasNextPage = stories.length > input.limit;

        if (hasNextPage) {
          stories.pop();
        }

        const nextCursor = stories[stories.length - 1]?.id;

        return { stories, hasNextPage, nextCursor };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to search stories",
        });
      }
    }),

  // ----- Mutations -----
  new: authorProcedure
    .input(
      z.object({
        title: z.string().min(2, {
          message: "Title must be at least 2 characters.",
        }),
        description: z.string().min(10, {
          message: "Description must be at least 10 characters.",
        }),
        category: z.string().optional(),
        isMature: z.boolean().default(false),
        isPremium: z.boolean().default(false),
        tags: z.array(z.string()).optional(),
        thumbnail: z.string().min(1).url({
          message: "Thumbnail must be a valid URL",
        }),
      }),
      // formSchema.omit({ thumbnail: true }).extend({
      //   thumbnail: z.string().min(1).url({
      //     message: "Thumbnail must be a valid URL",
      //   }),
      // }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = slugify(
          input.title + "-" + Math.random().toString(36).substring(7),
          slugy,
        );

        const story = await ctx.db.story.create({
          data: {
            ...input,
            slug,
            author_id: ctx.user.id,
          },
          select: {
            id: true,
          },
        });

        const chapterId = await ctx.db.chapter.create({
          data: {
            story_id: story.id,
          },
          select: {
            id: true,
          },
        });

        return {
          chapterId: chapterId.id,
        };
      } catch (err) {
        console.log({ err });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create story, please try again",
        });
      }
    }),

  update: authorProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        thumbnail: z.string(),
        tags: z.array(z.string()),
        isPremium: z.boolean(),
        category: z.string(),
        audience: z.string(),
        isMature: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...rest } = input;
        const story = await ctx.db.story.update({
          where: {
            id: id,
          },
          data: rest,
        });

        return story;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update story, please try again",
        });
      }
    }),

  delete: authorProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.story.update({
          where: {
            id: input.id,
          },
          data: {
            is_deleted: true,
          },
        });

        return true;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete story, please try again",
        });
      }
    }),

  addToReadingList: privateProcedure
    .input(
      z.object({
        readingListId: z.string(),
        storyId: z.string(),
        newListTitle: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const exisitingReadingList = await ctx.db.readingList.findFirst({
          where: {
            id: input.readingListId,
          },
          select: {
            id: true,
          },
        });

        if (!exisitingReadingList) {
          await ctx.db.readingList.create({
            data: {
              title: input.newListTitle ?? "New Reading lists",
              stories: {
                connect: {
                  id: input.storyId,
                },
              },
              slug: slugify(
                (input.newListTitle ?? "New Reading lists") +
                  "-" +
                  input.readingListId,
                slugy,
              ),
              id: input.readingListId,
              authorId: ctx.user.id,
            },
          });
        } else {
          await ctx.db.readingList.update({
            where: {
              id: input.readingListId,
            },
            data: {
              stories: {
                connect: {
                  id: input.storyId,
                },
              },
            },
          });
        }

        return true;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add story to reading list",
        });
      }
    }),

  removeReadingListStory: privateProcedure
    .input(
      z.object({
        storyId: z.string(),
        readingListSlug: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.readingList.update({
          where: {
            slug: input.readingListSlug,
          },
          data: {
            stories: {
              disconnect: {
                id: input.storyId,
              },
            },
          },
        });

        return true;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to remove story from reading list",
        });
      }
    }),
});
