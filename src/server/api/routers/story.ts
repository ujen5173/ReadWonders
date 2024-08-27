import { Prisma, type PrismaClient } from "@prisma/client";
import { type DefaultArgs } from "@prisma/client/runtime/library";
import { TRPCError } from "@trpc/server";
import slugify from "slugify";
import type Stripe from "stripe";
import { z } from "zod";
import { limit, skip, slugy } from "~/server/constants";
import type { SearchByTitle, TCard, User } from "~/types";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import { TCardSelect } from "./../../constants/db";

export const storyRouter = createTRPCRouter({
  randomTale: publicProcedure.query(async ({ ctx }) => {
    try {
      const story = await ctx.db.$queryRaw<
        | {
            slug: string;
          }[]
        | undefined
      >`
        SELECT s.slug
        FROM public.story s
        JOIN (
            SELECT "storyId", COUNT(*) as chapter_count
            FROM public.chapter
            GROUP BY "storyId"
        ) c ON s.id = c."storyId"
        WHERE s.published = true
          AND s."isDeleted" = false
          AND c.chapter_count >= 0
          AND s.love >= 0
          AND s.reads >= 0
          AND s."averageRating" >= 0
        ORDER BY RANDOM()
        LIMIT 1;
        `;

      return story;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Tech Glitch! Server's Taking a Nap",
      });
    }
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
                isDeleted: false,
              },
              select: {
                id: true,
                title: true,
                slug: true,
                sn: true,
                createdAt: true,
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
        const userId = ctx.session.user.id;

        const stories: (TCard & { readingList: boolean | null })[] = await ctx
          .db.$queryRaw`
          WITH UserPreferences AS (
            SELECT 
              ${userId}::uuid AS user_id, 
              ARRAY_REMOVE(ARRAY_AGG(DISTINCT crs."A"), NULL) AS current_reads,
              ARRAY_REMOVE(ARRAY_AGG(DISTINCT f."followingId"), NULL) AS followed_authors
            FROM 
              "User" p
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
              s."isMature",
              s."readingTime",
              s.slug,
              s.tags,
              COUNT(DISTINCT c.id) AS chapter_count,
              COALESCE(SUM(c."readingTime"), 0) AS total_read_time,
              COUNT(DISTINCT crs."B") AS current_read_count
            FROM 
              story s
              LEFT JOIN chapter c ON s.id = c."storyId" AND c.published = true AND c."isDeleted" = false
              LEFT JOIN "_CurrentReadsToStory" crs ON s.id = crs."A"
            WHERE 
              s.published = true 
              AND s."isDeleted" = false
            GROUP BY 
              s.id, s."authorId", s.title, s.description, s.thumbnail, s."categoryName", s."createdAt", s.reads, s.love, s."isMature", s.slug, s.tags
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
                 0.1 * ln(sm.current_read_count + 1)
              ) * (1.0 / (EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - sm."createdAt")) / 86400 + 1)) AS recommendation_score
            FROM 
              StoryMetrics sm
              CROSS JOIN UserPreferences up
            WHERE 
              sm.story_id != ALL(COALESCE(up.current_reads, ARRAY[]::uuid[]))
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
                  'isPremium', c."isPremium",
                  'title', c.title,
                  'slug', c.slug,
                  'createdAt', c."createdAt"
                )
              ) AS chapters
            FROM 
              chapter c
            WHERE 
              c.published = true
              AND c."isDeleted" = false
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
            rr."categoryName",
            rr."isMature",
            rr."readingTime",
            rr.reads,
            COALESCE(ci.chapters, '[]'::json) AS chapters,
            json_build_object(
              'name', p.name,
              'username', p.username,
              'profile', p.profile
            ) AS author,
            EXISTS (
              SELECT 1 
              FROM reading_list rl 
              JOIN "_ReadingListToStory" rls ON rl.id = rls."A" 
              WHERE rls."B" = rr.story_id AND rl."authorId" = ${userId ?? "NULL"}::uuid
            ) AS "readingList"
          FROM 
            RankedRecommendations rr
            JOIN "User" p ON rr."authorId" = p.id
            LEFT JOIN ChapterInfo ci ON rr.story_id = ci."storyId"
          WHERE 
            rr.rank <= 50
          ORDER BY 
            rr.recommendation_score DESC
          LIMIT ${input.limit} OFFSET ${input.skip}
        `;

        const processedStories = stories.map((story) => ({
          ...story,
          readingList: story.readingList ?? false,
        }));

        return processedStories as (TCard & { readingList: boolean })[];
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
          where: {
            isDeleted: false,
            slug: input.slug,
          },
          select: {
            story: {
              select: {
                author: {
                  select: {
                    id: true,
                  },
                },
                tags: true,
                slug: true,
                readingTime: true,
                categoryName: true,
              },
            },
          },
        });

        if (!inputStory) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "The tale has not been brought to life.",
          });
        }

        const story = inputStory.story;

        const similarStories = await ctx.db.story.findMany({
          where: {
            slug: { not: inputStory.story.slug },
            isDeleted: false,
            published: true,
            OR: [
              { tags: { hasSome: story.tags } },
              { categoryName: story.categoryName },
            ],
          },
          orderBy: [{ reads: "desc" }, { love: "desc" }, { reads: "desc" }],
          select: TCardSelect(ctx?.session?.user?.id),
          take: input.limit,
        });

        // Sort the results based on the number of matching tags

        const sortedSimilarStories = similarStories
          .sort((a, b) => {
            const aMatchingTags = a.tags.filter((tag) =>
              story.tags.includes(tag),
            ).length;
            const bMatchingTags = b.tags.filter((tag) =>
              story.tags.includes(tag),
            ).length;

            return bMatchingTags - aMatchingTags;
          })
          .map((e) => ({
            ...e,
            readingList: (e.readingLists ?? []).length > 0,
          }));

        return sortedSimilarStories;
      } catch (err) {
        console.log({ err });

        if (err instanceof TRPCError) {
          throw err;
        }

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
            isDeleted: false,
            published: true,
            categoryName: {
              equals: input.slug,
              mode: "insensitive",
            },
          },
          include: {
            chapters: {
              where: {
                isDeleted: false,
                published: true,
              },
              select: {
                id: true,
                title: true,
                slug: true,
                sn: true,
                isPremium: true,
                createdAt: true,
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
      const userId = ctx?.session?.user?.id ?? null;

      try {
        const mostLoved: (TCard & { readingList: boolean | null })[] = await ctx
          .db.$queryRaw`
         WITH MonthlyStats AS (
    SELECT
        s.id,
        s.title,
        s.slug,
        s.description,
        s.thumbnail,
        s.tags,
        s."isMature",
        s."categoryName",
        s."readingTime",
        s."authorId",
        COUNT(DISTINCT cr.id) AS current_reads,
        COUNT(DISTINCT rl.id) AS reading_lists,
        COALESCE(s.love, 0) AS love,
        (COUNT(DISTINCT cr.id) * 2 +
        COUNT(DISTINCT rl.id) * 3 +
        COALESCE(s.love, 0) * 4) AS love_score
    FROM
        story s
        LEFT JOIN "_CurrentReadsToStory" crts ON s.id = crts."B"
        LEFT JOIN current_reads cr ON crts."A" = cr.id AND cr."createdAt" >= DATE_TRUNC('month', CURRENT_DATE)
        LEFT JOIN "_ReadingListToStory" rlts ON s.id = rlts."B"
        LEFT JOIN reading_list rl ON rlts."A" = rl.id AND rl."createdAt" >= DATE_TRUNC('month', CURRENT_DATE)
    WHERE
        s.published = true
        AND s."isDeleted" = false
    GROUP BY
        s.id, s.title, s.slug, s.description, s.thumbnail, s.tags, s."isMature", s."categoryName", s."authorId", s.love
)
SELECT
    ms.*,
    json_build_object(
        'name', u.name,
        'profile', u.profile,
        'username', u.username
    ) AS author,
    json_build_object(
        'name', g.name,
        'slug', g.slug
    ) AS category,
    (
        SELECT json_agg(json_build_object(
            'id', c.id,
            'title', c.title,
            'createdAt', c."createdAt",
            'slug', c.slug,
            'sn', c.sn,
            'isPremium', c."isPremium"
        ))
        FROM chapter c
        WHERE c."storyId" = ms.id
        AND c.published = true
        AND c."isDeleted" = false
    ) AS chapters,
    CASE
        WHEN ${userId}::uuid IS NOT NULL THEN
            EXISTS (
                SELECT 1
                FROM reading_list rl
                JOIN "_ReadingListToStory" rls ON rl.id = rls."A"
                WHERE rls."B" = ms.id AND rl."authorId" = ${userId}::uuid
            )
        ELSE FALSE
    END AS "readingList"
FROM
    MonthlyStats ms
    JOIN "User" u ON ms."authorId" = u.id
    LEFT JOIN genre g ON ms."categoryName" = g.name
ORDER BY
    ms.love_score DESC
LIMIT ${input.limit} OFFSET ${input.skip}
        `;
        // Then, if you want to convert null to false:
        const processedMostLoved = mostLoved.map((story) => ({
          ...story,
          readingList: story.readingList ?? false,
        }));

        return processedMostLoved as (TCard & { readingList: boolean })[];
      } catch (err) {
        console.log({ err });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch most loved stories",
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
            isDeleted: false,
            published: true,
          },
          include: {
            category: {
              select: {
                slug: true,
              },
            },
            ratings: ctx?.session?.user?.id
              ? {
                  where: { userId: ctx.session.user.id },
                  select: {
                    value: true,
                  },
                }
              : false,
            chapters: {
              where: {
                isDeleted: false,
              },
              select: {
                id: true,
                title: true,
                published: true,
                sn: true,
                slug: true,
                createdAt: true,
                isPremium: true,
              },
              orderBy: {
                createdAt: "asc",
              },
            },
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                profile: true,
                followers:
                  ctx?.session?.user?.id !== undefined
                    ? {
                        select: {
                          id: true,
                        },
                        where: {
                          followingId: ctx?.session?.user?.id,
                        },
                      }
                    : false,
              },
            },
          },
        });

        if (!story) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Whoops! Plot Twist: No Story Here",
          });
        }

        return {
          ...story,
          ratings:
            (story.ratings ?? []).length > 0
              ? (story.ratings[0]?.value ?? 0)
              : 0,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Tech Glitch! Server's Taking a Nap",
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
            authorId: ctx.session.user.id,
          },
          select: {
            id: true,
            title: true,
            description: true,
            tags: true,
            isMature: true,
            categoryName: true,
            slug: true,
            published: true,
            thumbnail: true,
            chapters: {
              select: {
                id: true,
                title: true,
                slug: true,
                sn: true,
                isPremium: true,
                createdAt: true,
                published: true,
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
              where: {
                isDeleted: false,
                published: true,
              },
              select: TCardSelect(ctx?.session?.user?.id),
            },
          },
        });

        if (!readingList) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Reading List 404: Pages Still Being Written",
          });
        }

        // Process the result to add the readingList flag
        const processedStories = {
          ...readingList,
          stories:
            readingList?.stories.map((story) => ({
              ...story,
              readingList: (story.readingLists ?? []).length > 0,
            })) ?? [],
        };

        return processedStories;
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Tech Glitch! Server's Taking a Nap",
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
            isDeleted: false,
            published: true,
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
        const userId = ctx?.session?.user?.id ?? null;

        const topStoriesMultipleGenres: (TCard & {
          readingList: boolean | null;
        })[] = await ctx.db.$queryRaw`
          WITH GenreCounts AS (
              SELECT 
                g.name AS genre_name,
                g.slug AS genre_slug,
                COUNT(s.id) AS story_count
              FROM 
                genre g
              JOIN 
                story s ON g.name = s."categoryName"
              WHERE 
                s.published = true
                AND s."isDeleted" = false
              GROUP BY 
                g.name, g.slug
            ),
            TopGenres AS (
              SELECT 
                genre_name,
                genre_slug
              FROM 
                GenreCounts
              ORDER BY 
                story_count DESC
              LIMIT 6
            ),
            RankedStories AS (
              SELECT 
                s.*,
                ROW_NUMBER() OVER (PARTITION BY s."categoryName" ORDER BY s.reads DESC) AS rank
              FROM 
                story s
              JOIN 
                TopGenres tg ON s."categoryName" = tg.genre_name
              WHERE 
                s.published = true
                AND s."isDeleted" = false
            )
            SELECT 
              rs.id,
              rs.title,
              rs.slug,
              rs.description,
              rs.thumbnail,
              rs.tags, 
              rs."isMature",
              rs."categoryName",
              rs.reads,
              (
                SELECT json_agg(json_build_object(
                  'id', c.id,
                  'title', c.title,
                  'createdAt', c."createdAt",
                  'slug', c.slug,
                  'sn', c.sn,
                  'isPremium', c."isPremium"
                ))
                FROM chapter c
                WHERE c."storyId" = rs.id
                AND c.published = true
                AND c."isDeleted" = false
              ) AS chapters,
              json_build_object(
                'name', p.name,
                'profile', p.profile,
                'username', p.username
              ) AS author,
              json_build_object(
                'name', tg.genre_name,
                'slug', tg.genre_slug
              ) AS category,
              CASE 
                WHEN ${userId}::uuid IS NOT NULL THEN
                  EXISTS (
                    SELECT 1 
                    FROM reading_list rl 
                    JOIN "_ReadingListToStory" rls ON rl.id = rls."A" 
                    WHERE rls."B" = rs.id AND rl."authorId" = ${userId}::uuid
                  )
                ELSE NULL
              END AS "readingList"
            FROM 
              RankedStories rs
              JOIN "User" p ON rs."authorId" = p.id
              JOIN TopGenres tg ON rs."categoryName" = tg.genre_name
            WHERE 
              rs.rank <= 5
            ORDER BY 
              tg.genre_name, rs.reads DESC
            LIMIT ${input.limit}
        `;

        const processedStories = topStoriesMultipleGenres.map((story) => ({
          ...story,
          readingList: story.readingList ?? false,
        }));

        return processedStories as (TCard & { readingList: boolean })[];
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
        const userId = ctx?.session?.user?.id ?? null;
        const featuredStories: (TCard & { readingList: boolean | null })[] =
          await ctx.db.$queryRaw`
          WITH CategoryCounts AS (
            SELECT 
              "categoryName",
              COUNT(*) as story_count
            FROM 
              story
            WHERE 
              published = true
              AND "isDeleted" = false
            GROUP BY 
              "categoryName"
          ),
          RankedStories AS (
            SELECT 
              s.id,
              s.title,
              s.slug,
              s.description,
              s.thumbnail,
              s.tags,
              s."isMature",
              s."categoryName",
              s."readingTime",
              s.reads,
              s."authorId", 
              cc.story_count
            FROM 
              story s
            LEFT JOIN
              CategoryCounts cc ON s."categoryName" = cc."categoryName"
            WHERE 
              s.published = true
              AND s."isDeleted" = false
              AND s."createdAt" >= CURRENT_DATE - INTERVAL '30 days'
          )
          SELECT 
            rs.id,
            rs.title,
            rs.slug,
            rs.description,
            rs.thumbnail,
            rs.tags,
            rs."isMature",
            rs."categoryName",
            rs."readingTime",
            rs.reads,
            rs.story_count,
            (
              SELECT json_agg(json_build_object(
                'id', c.id,
                'title', c.title,
                'createdAt', c."createdAt",
                'isPremium', c."isPremium",
                'slug', c.slug,
                'sn', c.sn
              ))
              FROM chapter c
              WHERE c."storyId" = rs.id
              AND c.published = true
              AND c."isDeleted" = false
            ) AS chapters,
            json_build_object(
              'name', p.name,
              'profile', p.profile,
              'username', p.username
            ) AS author,
            json_build_object(
              'name', g.name,
              'slug', g.slug
            ) AS category,
            CASE 
              WHEN ${userId}::uuid IS NOT NULL THEN
                EXISTS (
                  SELECT 1 
                  FROM reading_list rl 
                  JOIN "_ReadingListToStory" rls ON rl.id = rls."A" 
                  WHERE rls."B" = rs.id AND rl."authorId" = ${userId}::uuid
                )
              ELSE NULL
            END AS "readingList"
          FROM 
            RankedStories rs
            JOIN "User" p ON rs."authorId" = p.id
            LEFT JOIN genre g ON rs."categoryName" = g.name
          ORDER BY 
            rs.story_count DESC,
            rs.reads DESC
          LIMIT ${input.limit} OFFSET ${input.skip}
        `;

        const processedStories = featuredStories.map((story) => ({
          ...story,
          readingList: story.readingList ?? false,
        }));

        return processedStories as (TCard & { readingList: boolean })[];
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
          select: TCardSelect(ctx?.session?.user?.id),
          where: {
            published: true,
            isDeleted: false,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        // Process the result to add the readingList flag
        const processedStories =
          stories.map((story) => ({
            ...story,
            readingList: (story.readingLists ?? []).length > 0,
          })) ?? [];

        return processedStories;
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
          authorId: ctx.session.user.id,
        },
        select: {
          id: true,
          thumbnail: true,
          title: true,
          slug: true,
          reads: true,
          published: true,
          chapters: {
            where: {
              published: true,
              isDeleted: false,
            },
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
            len: z.string().optional().default("1-10"),
            mature: z.boolean().optional().default(false),
            updated: z.string().optional().default("anytime"),
            premium: z.boolean().optional().default(false),
          })
          .optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { query, cursor } = input;

        const userId = ctx?.session?.user?.id?.toString();

        if (!query) {
          return { stories: [], hasNextPage: false, nextCursor: undefined };
        }

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
                WHERE chapter."storyId" = story.id 
                AND LOWER(chapter.title) LIKE ${`%${term}%`}
                AND chapter.published = true
                AND chapter."isDeleted" = false
              )
            )
          `,
        );

        const lengthCondition = input.filter?.len
          ? Prisma.sql`
            AND (
              SELECT COUNT(*) FROM chapter 
              WHERE chapter."storyId" = story.id
              AND chapter.published = true
              AND chapter."isDeleted" = false
            ) BETWEEN ${parseInt(input.filter.len.split("-")[0] ?? "0")} AND ${input.filter.len.split("-")[1] === "50+" ? "50" : parseInt(input.filter.len.split("-")[1] ?? "100")}
          `
          : Prisma.empty;

        const matureCondition = input.filter?.mature
          ? Prisma.sql`
            AND story."isMature" = ${input.filter.mature}
          `
          : Prisma.empty;

        const premiumCondition = input.filter?.premium
          ? Prisma.sql`
          AND EXISTS (
            SELECT 1
            FROM chapter
            WHERE chapter."storyId" = story.id
            AND chapter.published = true
            AND chapter."isDeleted" = false
            AND chapter."isPremium" = ${input.filter.premium}
          )
        `
          : Prisma.empty;

        const updatedCondition = (() => {
          if (!input.filter?.updated) return Prisma.empty;
          const now = new Date();

          let fromDate;

          switch (input.filter.updated) {
            case "today":
              fromDate = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
              );
              break;
            case "this week":
              fromDate = new Date(now.setDate(now.getDate() - now.getDay()));
              break;
            case "this month":
              fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
              break;
            case "this year":
              fromDate = new Date(now.getFullYear(), 0, 1);
              break;
            default:
              return Prisma.empty;
          }

          return Prisma.sql`AND story."updatedAt" >= ${fromDate.toISOString()}::timestamp`;
        })();

        const cursorCondition = cursor
          ? Prisma.sql`AND story.id::text > ${cursor}`
          : Prisma.empty;

        const stories = await ctx.db.$queryRaw<
          (TCard & { readingList: boolean })[]
        >`SELECT
          story.id,
          story.description,
          story.slug,
          story.title,
          story.thumbnail,
          story.tags,
          story."categoryName",
          story."isMature",
          story."readingTime",
          story.reads,
          COALESCE(json_agg(
            json_build_object(
              'id', chapter.id,
              'title', chapter.title,
              'sn', chapter.sn,
              'slug', chapter.slug,
              'isPremium', chapter."isPremium",
              'createdAt', chapter."createdAt"
            )
          ) FILTER (WHERE chapter.id IS NOT NULL AND chapter.published = true AND chapter."isDeleted" = false), '[]') AS chapters,
          json_build_object(
            'name', author.name,
            'username', author.username,
            'profile', author.profile
          ) AS author,
          CASE 
            WHEN ${userId}::uuid IS NOT NULL THEN
              EXISTS (
                SELECT 1 
                FROM reading_list rl 
                JOIN "_ReadingListToStory" rls ON rl.id = rls."A" 
                WHERE rls."B" = story.id AND rl."authorId" = ${userId}::uuid
              )
            ELSE FALSE
          END AS "readingList",
          COUNT(CASE WHEN chapter."isPremium" = true THEN 1 END) AS premium_chapter_count
        FROM story
        LEFT JOIN chapter ON chapter."storyId" = story.id AND chapter.published = true AND chapter."isDeleted" = false
        LEFT JOIN "User"AS author ON author.id = story."authorId"
        WHERE ${Prisma.join(searchConditions, " AND ")}
        AND story.published = true
        AND story."isDeleted" = false
        ${lengthCondition}
        ${matureCondition}
        ${updatedCondition}
        ${cursorCondition}
        ${premiumCondition}
        GROUP BY story.id, author.name, author.profile, author.username
        ${
          input.filter?.premium
            ? Prisma.sql`
              HAVING COUNT(CASE WHEN chapter."isPremium" = true THEN 1 END) > 0
            `
            : Prisma.empty
        }
        ORDER BY 
          ${
            input.filter?.premium
              ? Prisma.sql`COUNT(CASE WHEN chapter."isPremium" = true THEN 1 END) DESC,`
              : Prisma.empty
          }
          story.id
        LIMIT ${input.limit + 1}
        `;
        const processedstories = stories.map((story) => ({
          ...story,
          readingList: story.readingList ?? false,
        }));

        const hasNextPage = processedstories.length > input.limit;

        if (hasNextPage) {
          processedstories.pop();
        }

        const nextCursor = processedstories[processedstories.length - 1]?.id;

        return { stories: processedstories, hasNextPage, nextCursor };
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
        categoryName: z.string().optional(),
        isMature: z.boolean().default(false),
        tags: z.array(z.string()).optional(),
        thumbnail: z.string().min(1).url({
          message: "Thumbnail must be a valid URL",
        }),
        edit: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { edit, ...rest } = input;

        const slug = slugify(
          rest.title + "-" + ctx.session.user.id.slice(0, 5) + "-" + Date.now(),
          slugy,
        );

        if (edit) {
          const story = await ctx.db.story.update({
            where: {
              id: edit,
            },
            data: {
              ...rest,
              slug,
              authorId: ctx.session.user.id,
            },
            select: {
              slug: true,
            },
          });

          if (story)
            return {
              slug: story.slug,
            };

          return {
            slug: null,
          };
        }

        const story = await ctx.db.story.create({
          data: {
            ...rest,
            slug,
            authorId: ctx.session.user.id,
          },
          select: {
            id: true,
            title: true,
          },
        });

        const chapterId = await ctx.db.chapter.create({
          data: {
            storyId: story.id,
            title: "Untitled Chapter 1",
            slug: slugify("Untitled Chapter 1 - " + story.title, slugy),
          },
          select: {
            slug: true,
          },
        });

        return {
          slug: chapterId.slug,
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
            authorId: ctx.session.user.id,
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
            authorId: ctx.session.user.id,
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
              authorId: ctx.session.user.id,
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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const readingList = await ctx.db.readingList.findFirst({
          where: {
            stories: {
              some: {
                id: input.storyId,
              },
            },
            authorId: ctx.session.user.id,
          },
          select: {
            slug: true,
            stories: {
              where: {
                id: input.storyId,
              },
            },
          },
        });

        if (!readingList) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Reading list or story not found",
          });
        }

        if (readingList.stories.length > 0) {
          await ctx.db.readingList.update({
            where: {
              slug: readingList.slug,
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
        } else {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Story not found in the reading list",
          });
        }
      } catch (err) {
        console.log({ err });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to remove story from reading list",
        });
      }
    }),

  rating: privateProcedure
    .input(
      z.object({
        storyId: z.string(),
        rating: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { storyId, rating: value } = input;
        const userId = ctx.session.user.id;

        const authorStory = await ctx.db.story.findFirst({
          where: {
            id: ctx.session.user.id,
          },
          select: {
            id: true,
          },
        });

        if (!authorStory) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Oopsie! Your Story Needs a Reader's Review",
          });
        }

        const existingRating = await ctx.db.rating.findUnique({
          where: {
            userId_storyId: {
              userId,
              storyId,
            },
          },
        });

        if (existingRating) {
          // Update existing rating
          await ctx.db.rating.update({
            where: {
              id: existingRating.id,
            },
            data: {
              value,
            },
          });

          const result = await updateStoryRating(ctx, storyId);

          return result;
        } else {
          // Create new rating
          await ctx.db.rating.create({
            data: {
              userId,
              storyId,
              value,
            },
          });

          const result = await updateStoryRating(ctx, storyId);

          return result;
        }
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Tech Glitch! Server's Taking a Nap",
        });
      }
    }),

  love: privateProcedure
    .input(
      z.object({
        story: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const story = await ctx.db.story.findFirst({
          where: { id: input.story },
          select: {
            loves: {
              where: {
                userId: ctx.session.user.id,
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

        if (story.loves.length) {
          // User has already loved the story, so remove the love
          await ctx.db.$transaction([
            ctx.db.story.update({
              where: { id: input.story },
              data: {
                love: {
                  decrement: 1,
                },
              },
            }),
            ctx.db.love.delete({
              where: {
                storyId_userId: {
                  storyId: input.story,
                  userId: ctx.session.user.id,
                },
              },
            }),
          ]);

          return false;
        } else {
          // User has not loved the story yet, so add the love
          await ctx.db.$transaction([
            ctx.db.story.update({
              where: { id: input.story },
              data: {
                love: {
                  increment: 1,
                },
              },
            }),
            ctx.db.love.create({
              data: {
                storyId: input.story,
                userId: ctx.session.user.id,
              },
            }),
          ]);

          return true;
        }
      } catch (err) {
        console.log({ err });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to love story",
        });
      }
    }),

  hasLiked: privateProcedure
    .input(
      z.object({
        storyId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;

        const liked = await ctx.db.love.findFirst({
          where: {
            storyId: input.storyId,
            userId,
          },
        });

        return !!liked;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to check if story is liked",
        });
      }
    }),
});

async function updateStoryRating(
  ctx: {
    session: {
      user: User;
      expires: string;
    };
    db: PrismaClient<
      {
        log: ("query" | "warn" | "error")[];
      },
      never,
      DefaultArgs
    >;
    headers: Headers;
    stripe: Stripe;
  },
  storyId: string,
) {
  const ratings = await ctx.db.rating.findMany({
    where: {
      storyId,
    },
    select: {
      value: true,
    },
  });

  const ratingCount = ratings.length;
  const averageRating =
    ratingCount > 0
      ? ratings.reduce(
          (sum: number, rating: { value: number }) => sum + rating.value,
          0,
        ) / ratingCount
      : 0;

  await ctx.db.story.update({
    where: {
      id: storyId,
    },
    data: {
      averageRating,
      ratingCount,
    },
  });

  return {
    averageRating,
    ratingCount,
  };
}
