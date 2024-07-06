import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { User } from "@supabase/supabase-js";
import { type TCard } from "~/types";

export const featuredStoriesSQL = `
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
      s."isPremium",
      s."isMature",
      s."categoryName",
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
    rs."isPremium",
    rs."isMature",
    rs."categoryName",
    rs.reads,
    rs.story_count,
    (
      SELECT json_agg(json_build_object(
        'id', c.id,
        'title', c.title,
        'createdAt', c."createdAt",
        'slug', c.slug
      ))
      FROM chapter c
      WHERE c."storyId" = rs.id
    ) AS chapters,
    json_build_object(
      'name', p.name,
      'profile', p.profile,
      'username', p.username
    ) AS author,
    json_build_object(
      'name', g.name,
      'slug', g.slug
    ) AS category
  FROM 
    RankedStories rs
    JOIN profiles p ON rs."authorId" = p.id
    LEFT JOIN genre g ON rs."categoryName" = g.name
  ORDER BY 
    rs.story_count DESC,
    rs.reads DESC
`;

export const topPicksSQL = `
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
    rs."isPremium",
    rs."isMature",
    rs."categoryName",
    rs.reads,
    (
      SELECT json_agg(json_build_object(
        'id', c.id,
        'title', c.title,
        'createdAt', c."createdAt",
        'slug', c.slug
      ))
      FROM chapter c
      WHERE c."storyId" = rs.id
    ) AS chapters,
    json_build_object(
      'name', p.name,
      'profile', p.profile,
      'username', p.username
    ) AS author,
    json_build_object(
      'name', tg.genre_name,
      'slug', tg.genre_slug
    ) AS category
  FROM 
    RankedStories rs
    JOIN profiles p ON rs."authorId" = p.id
    JOIN TopGenres tg ON rs."categoryName" = tg.genre_name
  WHERE 
    rs.rank <= 5
  ORDER BY 
    tg.genre_name, rs.reads DESC
`;

export const mostLovedSQL = `
  WITH MonthlyStats AS (
    SELECT 
      s.id AS story_id,
      s.title,
      s.slug,
      s.description,
      s.thumbnail,
      s.tags,
      s."isPremium",
      s."isMature",
      s."categoryName",
      s."authorId",
      COUNT(DISTINCT cr.id) AS current_reads,
      COUNT(DISTINCT rl.id) AS reading_lists,
      COALESCE(s.love, 0) AS love,
      COUNT(DISTINCT b.id) AS bookmarks,
      (COUNT(DISTINCT cr.id) * 2 +
      COUNT(DISTINCT rl.id) * 3 +
      COALESCE(s.love, 0) * 4 +
      COUNT(DISTINCT b.id) * 2) AS love_score
    FROM 
      story s
      LEFT JOIN "_CurrentReadsToStory" crts ON s.id = crts."B"
      LEFT JOIN current_reads cr ON crts."A" = cr.id AND cr."createdAt" >= DATE_TRUNC('month', CURRENT_DATE)
      LEFT JOIN "_ReadingListToStory" rlts ON s.id = rlts."B"
      LEFT JOIN reading_list rl ON rlts."A" = rl.id AND rl."createdAt" >= DATE_TRUNC('month', CURRENT_DATE)
      LEFT JOIN bookmark b ON s.id = b."storyId" AND b."createdAt" >= DATE_TRUNC('month', CURRENT_DATE)
    WHERE 
      s.published = true
      AND s."isDeleted" = false
    GROUP BY 
      s.id, s.title, s.slug, s.description, s.thumbnail, s.tags, s."isPremium", s."isMature", s."categoryName", s."authorId", s.love
  )
  SELECT 
    ms.*,
    json_build_object(
      'name', p.name,
      'profile', p.profile,
      'username', p.username
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
        'slug', c.slug
      ))
      FROM chapter c
      WHERE c."storyId" = ms.story_id
    ) AS chapters
  FROM 
    MonthlyStats ms
    JOIN profiles p ON ms."authorId" = p.id
    LEFT JOIN genre g ON ms."categoryName" = g.name
  ORDER BY 
    ms.love_score DESC
`;

export const searchSystemSQL = async (
  searchTerms: string[],
  input: {
    limit: number;
    filter?:
      | {
          len?: string | undefined;
          mature?: string | undefined;
          premium?: string | undefined;
          updated?: string | undefined;
        }
      | undefined;
    query?: string | undefined;
    cursor?: string | undefined;
  },
  cursor: string | undefined,
  ctx: {
    db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
    user: User | null;
    headers: Headers;
  },
) => {
  const searchConditions = searchTerms.map(
    (term) => Prisma.sql`
      (
        LOWER(story.title) LIKE ${`%${term}%`} OR
        LOWER(story.slug) LIKE ${`%${term}%`} OR
        LOWER(story.description) LIKE ${`%${term}%`} OR
        LOWER(ARRAY_TO_STRING(story.tags, ' ')) LIKE ${`%${term}%`} OR
        EXISTS (
          SELECT 1 FROM chapter
          WHERE chapter."storyId" = story.id AND LOWER(chapter.title) LIKE ${`%${term}%`}
        )
      )
    `,
  );

  const lengthCondition = input.filter?.len
    ? Prisma.sql`
        AND (
          SELECT COUNT(*) FROM chapter WHERE chapter."storyId" = story.id
        ) BETWEEN ${parseInt(input.filter.len.split("-")[0] ?? "0")} AND ${input.filter.len.split("-")[1] === "50+" ? "50" : parseInt(input.filter.len.split("-")[1] ?? "100")}
      `
    : Prisma.empty;

  const matureCondition = input.filter?.mature
    ? Prisma.sql`
        AND story."isMature" = ${input.filter.mature === "true"}
      `
    : Prisma.empty;

  const premiumCondition = input.filter?.premium
    ? Prisma.sql`
        AND story."isPremium" = ${input.filter.premium === "true"}
      `
    : Prisma.empty;

  const updatedCondition = (() => {
    if (!input.filter?.updated) return Prisma.empty;
    const now = new Date();

    let fromDate;

    switch (input.filter.updated) {
      case "today":
        fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
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

  const stories = await ctx.db.$queryRaw<TCard[]>`
    SELECT
      story.id,
      story.description,
      story.slug,
      story.title,
      story.thumbnail,
      story.tags,
      story."isPremium",
      story."categoryName",
      story."isMature",
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
    LEFT JOIN chapter ON chapter."storyId" = story.id
    LEFT JOIN profiles AS author ON author.id = story."authorId"
    WHERE ${Prisma.join(searchConditions, " AND ")}
    ${lengthCondition}
    ${matureCondition}
    ${premiumCondition}
    ${updatedCondition}
    ${cursorCondition}
    GROUP BY story.id, author.name, author.profile
    ORDER BY story.id
    LIMIT ${input.limit + 1}
  `;

  return stories;
};
