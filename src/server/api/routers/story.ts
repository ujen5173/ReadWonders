import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import slugify from "slugify";
import { z } from "zod";
import { limit, skip, slugy } from "~/server/constants";
import {
  featuredStoriesSQL,
  mostLovedSQL,
  searchSystemSQL,
  topPicksSQL,
} from "~/server/constants/sql";
import type { SearchByTitle, TCard } from "~/types";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import { TCardSelect } from "./../../constants/db";

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
              where: {
                published: true,
              },
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
                username: true,
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

  recommendations: privateProcedure
    .input(
      z.object({
        limit: z.number().default(limit),
        skip: z.number().default(skip),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;

        const stories = (await ctx.db.$queryRaw`
          WITH UserPreferences AS (
            SELECT 
              ${userId}::uuid AS user_id,
              ARRAY_REMOVE(ARRAY_AGG(DISTINCT b."storyId"), NULL) AS bookmarked_stories,
              ARRAY_REMOVE(ARRAY_AGG(DISTINCT crs."A"), NULL) AS current_reads,
              ARRAY_REMOVE(ARRAY_AGG(DISTINCT f."followingId"), NULL) AS followed_authors
            FROM 
              profiles p
              LEFT JOIN bookmark b ON p.id = b."userId"
              LEFT JOIN current_reads cr ON p.id = cr."userId"
              LEFT JOIN "_CurrentReadsToStory" crs ON cr.id = crs."B"
              LEFT JOIN follows f ON p.id = f."followerId"
            WHERE 
              p.id = ${userId}::uuid
            GROUP BY 
              p.id
          ),

          StoryMetrics AS (
            SELECT 
              s.id AS story_id,
              s."authorId",
              s.title,
              s.description,
              s.thumbnail,
              s."categoryName",
              s."createdAt",
              s.reads,
              s.love,
              s."isPremium",
              s."isMature",
              s."readingTime",
              s.slug,
              s.tags,
              COUNT(DISTINCT c.id) AS chapter_count,
              COALESCE(SUM(c."readingTime"), 0) AS total_read_time,
              COUNT(DISTINCT b.id) AS bookmark_count,
              COUNT(DISTINCT crs."B") AS current_read_count,
              COUNT(DISTINCT r.id) AS recommendation_count
            FROM 
              story s
              LEFT JOIN chapter c ON s.id = c."storyId"
              LEFT JOIN bookmark b ON s.id = b."storyId"
              LEFT JOIN "_CurrentReadsToStory" crs ON s.id = crs."A"
              LEFT JOIN recommended r ON s.id = r."storyId"
            WHERE 
              s.published = true 
              AND s."isDeleted" = false
            GROUP BY 
              s.id, s."authorId", s.title, s.description, s.thumbnail, s."categoryName", s."createdAt", s.reads, s.love, s."isPremium", s."isMature", s.slug, s.tags
          ),

          RecommendationScores AS (
            SELECT 
              sm.*,
              CASE 
                WHEN sm.chapter_count BETWEEN 3 AND 10 THEN 1.2
                ELSE 1.0
              END * CASE 
                WHEN sm.total_read_time BETWEEN 7200 AND 10800 THEN 1.2
                ELSE 1.0
              END * CASE 
                WHEN ARRAY_LENGTH(up.followed_authors, 1) > 0 AND sm."authorId" = ANY(up.followed_authors) THEN 1.3
                ELSE 1.0
              END * (
                0.3 * ln(sm.reads + 1) +
                0.2 * ln(sm.love + 1) +
                0.2 * ln(sm.bookmark_count + 1) +
                0.1 * ln(sm.current_read_count + 1) +
                0.2 * ln(sm.recommendation_count + 1)
              ) * (1.0 / (EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - sm."createdAt")) / 86400 + 1)) AS recommendation_score
            FROM 
              StoryMetrics sm
              CROSS JOIN UserPreferences up
            WHERE 
              sm.story_id != ALL(COALESCE(up.current_reads, ARRAY[]::uuid[]))
              AND sm.story_id != ALL(COALESCE(up.bookmarked_stories, ARRAY[]::uuid[]))
          ),

          RankedRecommendations AS (
            SELECT 
              rs.*,
              ROW_NUMBER() OVER (ORDER BY rs.recommendation_score DESC) AS rank
            FROM 
              RecommendationScores rs
          ),

          ChapterInfo AS (
            SELECT 
              c."storyId",
              json_agg(
                json_build_object(
                  'id', c.id,
                  'title', c.title,
                  'slug', c.slug,
                  'createdAt', c."createdAt"
                )
              ) AS chapters
            FROM 
              chapter c
            WHERE 
              c.published = true
            GROUP BY 
              c."storyId"
          )

          SELECT 
            rr.story_id AS id,
            rr.description,
            rr.slug,
            rr.title,
            rr.thumbnail,
            rr.love,
            rr.tags,
            rr."isPremium",
            rr."categoryName",
            rr."isMature",
            rr."readingTime",
            rr.reads,
            COALESCE(ci.chapters, '[]'::json) AS chapters,
            json_build_object(
              'name', p.name,
              'username', p.username,
              'profile', p.profile
            ) AS author
          FROM 
            RankedRecommendations rr
            JOIN profiles p ON rr."authorId" = p.id
            LEFT JOIN ChapterInfo ci ON rr.story_id = ci."storyId"
          WHERE 
            rr.rank <= 50
          ORDER BY 
            rr.recommendation_score DESC
          LIMIT ${input.limit} OFFSET ${input.skip};
        `) as TCard[];

        return stories;
      } catch (err) {
        console.log({ err });

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch stories",
        });
      }
    }),

  similar: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        limit: z.number().default(limit),
        skip: z.number().default(skip),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const inputStory = await ctx.db.chapter.findFirst({
          where: { slug: input.slug },
          select: {
            story: {
              select: {
                tags: true,
                readingTime: true,
                categoryName: true,
              },
            },
          },
        });

        if (!inputStory) {
          throw new Error("Input story not found");
        }

        const story = inputStory.story;

        const similarStories = await ctx.db.story.findMany({
          where: {
            slug: { not: input.slug },
            isDeleted: false,
            published: true,
            OR: [
              { tags: { hasSome: story.tags } },
              { categoryName: story.categoryName },
            ],
            readingTime: {
              gte: story.readingTime * 0.7,
              lte: story.readingTime * 1.3,
            },
          },
          orderBy: [{ reads: "desc" }, { love: "desc" }, { reads: "desc" }],
          select: TCardSelect,
          take: input.limit,
        });

        // Sort the results based on the number of matching tags

        const sortedSimilarStories = similarStories.sort((a, b) => {
          const aMatchingTags = a.tags.filter((tag) =>
            story.tags.includes(tag),
          ).length;
          const bMatchingTags = b.tags.filter((tag) =>
            story.tags.includes(tag),
          ).length;

          return bMatchingTags - aMatchingTags;
        });

        return sortedSimilarStories;
      } catch (err) {
        console.log({ err });

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch similar stories",
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
            categoryName: {
              equals: input.slug,
              mode: "insensitive",
            },
          },
          include: {
            chapters: {
              where: {
                published: true,
              },
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
                username: true,
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

  mostLoved: publicProcedure
    .input(
      z.object({
        limit: z.number().default(limit),
        skip: z.number().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const mostLoved = (await ctx.db.$queryRaw`
        ${Prisma.raw(mostLovedSQL)}
        LIMIT ${input.limit} OFFSET ${input.skip};
      `) as TCard[];

      return mostLoved;
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
            chapters: {
              select: {
                id: true,
                title: true,
                published: true,
                slug: true,
                createdAt: true,
              },
              orderBy: {
                createdAt: "asc",
              },
            },
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

  getStoryForUpdate: privateProcedure
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
            authorId: ctx.user.id,
          },
          include: {
            chapters: {
              where: {
                published: true,
              },
              select: {
                id: true,
                title: true,
                slug: true,
                createdAt: true,
              },
            },
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
              select: TCardSelect,
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
        const topStoriesMultipleGenres = (await ctx.db.$queryRaw`
          ${Prisma.raw(topPicksSQL)}
            LIMIT ${input.limit};
        `) as TCard[];

        return topStoriesMultipleGenres;
      } catch (err) {
        console.log({ err });
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
        const featuredStories = (await ctx.db.$queryRaw`
          ${Prisma.raw(featuredStoriesSQL)}
          LIMIT ${input.limit} OFFSET ${input.skip};
        `) as TCard[];

        return featuredStories;
      } catch (err) {
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
          select: TCardSelect,
          orderBy: {
            createdAt: "desc",
          },
        });

        return stories;
      } catch (err) {
        console.log({ err });
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
          authorId: ctx.user.id,
        },
        select: {
          id: true,
          thumbnail: true,
          title: true,
          slug: true,
          reads: true,
          published: true,
          chapters: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!stories) return [];

      return stories.map((s) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { chapters, ...rest } = s;

        return {
          ...rest,
          views: s.reads,
          total_chapters: s.chapters.length,
        };
      });
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
        query: z.string().optional(),
        limit: z.number().optional().default(limit),
        cursor: z.string().optional(),
        filter: z
          .object({
            len: z.string().optional(),
            mature: z.string().optional(),
            updated: z.string().optional(),
            premium: z.string().optional(),
          })
          .optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { query, cursor } = input;

        if (!query) {
          return { stories: [], hasNextPage: false, nextCursor: undefined };
        }

        const searchTerms = query.toLowerCase().split(/\s+/);

        const stories = await searchSystemSQL(searchTerms, input, cursor, ctx);

        const hasNextPage = stories.length > input.limit;

        if (hasNextPage) {
          stories.pop();
        }

        const nextCursor = stories[stories.length - 1]?.id;

        return { stories, hasNextPage, nextCursor };
      } catch (err) {
        console.log({ err });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to search stories",
        });
      }
    }),

  searchByTitle: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { query } = input;

        if (!query) {
          return [];
        }

        const searchTerms = query.toLowerCase().split(/\s+/);

        const searchConditions = searchTerms.map(
          (term) => Prisma.sql`
            (
              LOWER(story.title) LIKE ${`%${term}%`} OR
              LOWER(story.slug) LIKE ${`%${term}%`} OR
              LOWER(story.description) LIKE ${`%${term}%`} OR
              LOWER(ARRAY_TO_STRING(story.tags, ' ')) LIKE ${`%${term}%`}
            )
          `,
        );

        const stories = await ctx.db.$queryRaw<SearchByTitle[]>`
          SELECT
            story.id,
            story.slug,
            story.title
          FROM story
          WHERE ${Prisma.join(searchConditions, " AND ")}
          ORDER BY story.id
        `;

        return stories;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to search stories",
        });
      }
    }),

  // ----- Mutations -----
  new: privateProcedure
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
        edit: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { edit, category, ...rest } = input;

        const slug = slugify(rest.title + "-" + ctx.user.id.slice(0, 5), slugy);

        if (edit) {
          const story = await ctx.db.story.update({
            where: {
              id: edit,
            },
            data: {
              ...rest,
              slug,
              categoryName: category,
              authorId: ctx.user.id,
            },
            select: {
              slug: true,
            },
          });

          if (story)
            return {
              newSlug: story.slug,
            };

          return {
            newSlug: null,
          };
        }

        const story = await ctx.db.story.create({
          data: {
            ...rest,
            slug,
            authorId: ctx.user.id,
          },
          select: {
            id: true,
          },
        });

        const chapterId = await ctx.db.chapter.create({
          data: {
            storyId: story.id,
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

  update: privateProcedure
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
        const { id, category, ...rest } = input;
        const story = await ctx.db.story.update({
          where: {
            id: id,
            authorId: ctx.user.id,
          },
          data: {
            ...rest,
            categoryName: category,
          },
        });

        return story;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update story, please try again",
        });
      }
    }),

  delete: privateProcedure
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
            authorId: ctx.user.id,
          },
          data: {
            isDeleted: true,
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
            authorId: ctx.user.id,
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
