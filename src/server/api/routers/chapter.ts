import CharacterCount from "@tiptap/extension-character-count";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";

import TextAlign from "@tiptap/extension-text-align";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { TRPCError } from "@trpc/server";
import { type JSONContent } from "novel";
import read from "reading-time";
import slugify from "slugify";
import { z } from "zod";
import { limit, slugy } from "~/server/constants";
import { mainSchema } from "~/types/zod";
import { error } from "~/utils/helpers";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";

export const chapterRouter = createTRPCRouter({
  test: publicProcedure.query(() => {
    return "Chapter router";
  }),

  getChapters: publicProcedure
    .input(
      z.object({
        storyId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const chapters = await ctx.db.chapter.findMany({
          where: {
            storyId: input.storyId,
          },
          take: limit,
          select: {
            title: true,
            slug: true,
          },
        });

        return chapters;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch chapters",
        });
      }
    }),

  getSingeChapterById: publicProcedure
    .input(
      z.object({
        chapterId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const chapter = await ctx.db.chapter.findFirst({
          where: { id: input.chapterId },
        });

        if (!chapter) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Chapter not found",
          });
        }

        return chapter;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch chapter",
        });
      }
    }),

  getSingleChapter: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { slug } = input;

      try {
        const chapter = await db.chapter.findFirst({
          where: { slug },
          include: {
            unlockedBy: user ? { where: { id: user.id } } : false,
            story: {
              select: {
                id: true,
                thumbnail: true,
                title: true,
                slug: true,
                love: true,
                reads: true,
                totalChapterPrice: true,
                tags: true,
                author: {
                  select: {
                    followers: user
                      ? {
                          select: { id: true },
                          where: { followingId: user.id },
                        }
                      : false,
                    id: true,
                    name: true,
                    profile: true,
                    username: true,
                  },
                },
                chapters: {
                  orderBy: { createdAt: "asc" },
                  where: {
                    published: true,
                    isDeleted: false,
                  },
                  select: {
                    id: true,
                    title: true,
                    slug: true,
                    price: true,
                    isPremium: true,
                  },
                },
              },
            },
          },
        });

        if (!chapter) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Nonexistent Chapter: The Tale That Wasn't Told",
          });
        }

        const chapterIndex = chapter.story.chapters.findIndex(
          (c) => c.id === chapter.id,
        );
        const nextChapter =
          chapterIndex < chapter.story.chapters.length - 1
            ? chapter.story.chapters[chapterIndex + 1]
            : null;

        return {
          hasPaid: chapter.isPremium
            ? chapter.story.author.id === user?.id ||
              (chapter.unlockedBy ?? []).length > 0
            : true,
          data: {
            ...chapter,
            nextChapter,
          },
        };
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

  // ----- Mutation -----

  new: privateProcedure
    .input(
      z.object({
        story_id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { story_id, ...rest } = input;
        // new with slug unique number
        const newSlug: string = slugify(
          "new-chapter-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
          slugy,
        );
        const chapter = await ctx.db.chapter.create({
          data: {
            ...rest,
            storyId: story_id,
            title: "New Chapter",
            slug: newSlug,
          },
        });

        return chapter.id;
      } catch (err) {
        console.table(error({ err }));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create chapter",
        });
      }
    }),

  changeVisibility: privateProcedure
    .input(
      z.object({
        id: z.string(),
        published: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const res = await ctx.db.chapter.update({
          where: { id: input.id },
          data: {
            published: input.published,
          },
        });

        console.table({ res });

        return true;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to change visibility",
        });
      }
    }),

  update: privateProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        content: mainSchema,
        thumbnail: z.string().nullable(),
        isPremium: z.boolean(),
        scheduledAt: z.date().optional(),
        coins: z.number().nullable().default(10),
        published: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, isPremium, coins, ...rest } = input;

        const time = read(
          generateHTML(rest.content as JSONContent, [
            Placeholder,
            Youtube,
            Link,
            Underline,
            Image,
            CharacterCount,
            TextStyle,
            // @ts-expect-error: A bug due to overlaping with textalign from tiptap with noval
            StarterKit,
            TextAlign.configure({
              types: ["paragraph"],
            }),
          ]),
        );

        const story = await ctx.db.chapter.findFirst({
          where: { id: id },
          select: {
            story: {
              select: {
                slug: true,
              },
            },
          },
        });

        const chapter = await ctx.db.chapter.update({
          where: { id: id },
          data: {
            ...rest,
            slug: slugify(rest.title + "-" + story?.story.slug, slugy),
            readingTime: time.time,
            scheduledAt: input.scheduledAt,
            price: isPremium ? coins! : 0,
            isPremium,
            content: rest.content as JSONContent,
          },
          select: {
            slug: true,
            id: true,
            storyId: true,
          },
        });

        const calculateReadingTime = await ctx.db.chapter.findMany({
          where: { storyId: chapter.storyId },
          select: { readingTime: true, price: true },
        });

        const totalReadingTime = calculateReadingTime.reduce(
          (acc, curr) => acc + curr.readingTime,
          0,
        );

        await ctx.db.story.update({
          where: { id: chapter.storyId },
          data: {
            readingTime: totalReadingTime,
            totalChapterPrice: calculateReadingTime.reduce(
              (acc, curr) => acc + curr.price,
              0,
            ),
          },
        });

        console.log("story update completed");

        return { slug: chapter.slug };
      } catch (err) {
        console.log({ err });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update chapter",
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
        await ctx.db.chapter.update({
          where: { id: input.id },
          data: { isDeleted: true },
        });

        return true;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete chapter",
        });
      }
    }),

  read: privateProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const chapter = await ctx.db.chapter.findFirst({
          where: { id: input.id },
          select: {
            storyId: true,
            story: {
              select: {
                authorId: true,
              },
            },
          },
        });

        if (!chapter) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Chapter not found",
          });
        }

        const hasAlreadyRead = await ctx.db.currentReads.findFirst({
          where: {
            userId: ctx.user.id,
          },
          select: {
            stories: {
              select: {
                id: true,
              },
            },
          },
        });

        if (
          hasAlreadyRead?.stories.some((story) => story.id === chapter.storyId)
        ) {
          return true;
        }

        // Only increment reads if the user is not the author
        const shouldIncrement = ctx.user.id !== chapter.story.authorId;

        const [chapterupdate, storyupdate] = await ctx.db.$transaction([
          ctx.db.chapter.update({
            where: { id: input.id },
            data: shouldIncrement ? { reads: { increment: 1 } } : {}, // Increment only if not author
          }),
          ctx.db.story.update({
            where: { id: chapter.storyId },
            data: shouldIncrement ? { reads: { increment: 1 } } : {}, // Increment only if not author
          }),
          ctx.db.currentReads.upsert({
            where: {
              userId: ctx.user.id,
            },
            create: {
              userId: ctx.user.id,
              stories: {
                connect: {
                  id: chapter.storyId,
                },
              },
            },
            update: {
              stories: {
                connect: {
                  id: chapter.storyId,
                },
              },
            },
          }),
        ]);

        if (!chapterupdate || !storyupdate) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update chapter",
          });
        }

        return true;
      } catch (err) {
        console.log(error({ err }));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update chapter",
        });
      }
    }),
  unlockChapter: privateProcedure
    .input(
      z.object({
        id: z.string(),
        unlockType: z.enum(["single", "all"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const chapter = await ctx.db.chapter.findUnique({
          where: { id: input.id },
          include: {
            story: true,
            unlockedBy: {
              where: { id: ctx.user.id },
            },
          },
        });

        if (!chapter) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Chapter not found",
          });
        }

        if (chapter.story.authorId === ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You can't unlock your own chapter",
          });
        }

        // Check if the user has already unlocked this chapter
        if (chapter.unlockedBy.length > 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You have already unlocked this chapter",
          });
        }

        let chaptersToUnlock: { coins: number; id: string }[];

        if (input.unlockType === "single") {
          chaptersToUnlock = [{ coins: chapter.price, id: input.id }];
        } else {
          // Unlock all chapters of the story
          const allChapters = await ctx.db.chapter.findMany({
            where: {
              storyId: chapter.storyId,
              NOT: {
                unlockedBy: {
                  some: { id: ctx.user.id },
                },
              },
            },
            select: { id: true, price: true },
          });

          chaptersToUnlock = allChapters.map((c) => ({
            id: c.id,
            coins: c.price,
          }));
        }

        if (chaptersToUnlock.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "All chapters are already unlocked",
          });
        }

        const calculateTotalCoins = chaptersToUnlock.reduce(
          (acc, curr) => acc + curr.coins,
          0,
        );

        // Check if user has enough coins
        const userProfile = await ctx.db.profiles.findUnique({
          where: { id: ctx.user.id },
          select: { coins: true },
        });

        if (!userProfile || userProfile.coins < calculateTotalCoins) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Insufficient coins to unlock chapter(s)",
          });
        }

        const unlock = await ctx.db.profiles.update({
          where: { id: ctx.user.id },
          data: {
            unlockedChapters: {
              connect: chaptersToUnlock.map((c) => ({ id: c.id })),
            },
            coins: {
              decrement: calculateTotalCoins,
            },
          },
        });

        return unlock.id;
      } catch (err) {
        console.error("Error unlocking chapter:", err);

        if (err instanceof TRPCError) {
          throw err;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to unlock chapter",
        });
      }
    }),
});
