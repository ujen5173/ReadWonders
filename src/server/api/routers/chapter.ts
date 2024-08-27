import { TRPCError } from "@trpc/server";
import { type JSONContent } from "novel";
import read from "reading-time";
import slugify from "slugify";
import { z } from "zod";
import { limit, slugy } from "~/server/constants";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";

export const chapterRouter = createTRPCRouter({
  test: publicProcedure.query(() => {
    return "Chapter router";
  }),

  getChapters: publicProcedure
    .input(z.object({ storyId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db.chapter.findMany({
          where: { storyId: input.storyId },
          take: limit,
          select: { title: true, slug: true },
        });
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch chapters",
        });
      }
    }),

  getSingeChapterById: publicProcedure
    .input(z.object({ chapterId: z.string() }))
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

  getChapterForUpdate: privateProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        console.log({
          slug: input.slug,
          session: ctx.session.user.id,
        });
        const chapter = await ctx.db.chapter.findFirst({
          where: {
            slug: input.slug,
            story: {
              authorId: ctx.session.user.id,
            },
          },
          select: {
            id: true,
            // slug: true,
            title: true,
            content: true,
            isPremium: true,
            price: true,
            thumbnail: true,
            published: true,
            scheduledAt: true,
          },
        });

        if (!chapter) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Chapter not found 404",
          });
        }

        return chapter;
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          message: "Failed to fetch chapter",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  update: privateProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        content: z.unknown(),
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
        console.log("STARTED UPLOAD...");
        // const time = read(
        //   generateHTML(rest.content as JSONContent, editorExtensions),
        // );

        const time = read(JSON.stringify(rest.content));

        const story = await ctx.db.chapter.findFirst({
          where: { id },
          select: { story: { select: { slug: true } } },
        });

        const chapter = await ctx.db.chapter.update({
          where: { id },
          data: {
            ...rest,
            slug: slugify(rest.title + "-" + story?.story.slug, slugy),
            readingTime: time.time,
            scheduledAt: input.scheduledAt,
            price: isPremium ? coins! : 0,
            isPremium,
            content: rest.content as JSONContent,
          },
          select: { slug: true, id: true, storyId: true },
        });

        const calculateReadingTime = await ctx.db.chapter.findMany({
          where: { storyId: chapter.storyId },
          select: { readingTime: true, price: true },
        });

        const totalReadingTime = calculateReadingTime.reduce(
          (acc, curr) => acc + curr.readingTime,
          0,
        );
        const totalChapterPrice = calculateReadingTime.reduce(
          (acc, curr) => acc + curr.price,
          0,
        );

        await ctx.db.story.update({
          where: { id: chapter.storyId },
          data: { readingTime: totalReadingTime, totalChapterPrice },
        });

        return { slug: chapter.slug };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update chapter",
        });
      }
    }),

  getSingleChapter: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db, session } = ctx;

      const { slug } = input;

      const user = session?.user;

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
                    sn: true,
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
          chapterIndex !== -1 &&
          chapterIndex < chapter.story.chapters.length - 1
            ? chapter.story.chapters[chapterIndex + 1]
            : null;

        console.log({
          hasPaid: chapter.isPremium
            ? chapter.story.author.id === user?.id ||
              (chapter.unlockedBy ?? []).length > 0
            : true,
          data: {
            ...chapter,
            nextChapter,
          },
        });

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
        console.log({ err });

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

        const story = await ctx.db.story.findFirst({
          where: { id: story_id },
          select: { slug: true, _count: { select: { chapters: true } } },
        });

        const newSlug: string = slugify(
          "New Chapter " + story?.slug ??
            "" + ctx.session.user.id.slice(0, 5) + "-" + Date.now(),
          slugy,
        );

        const chapter = await ctx.db.chapter.create({
          data: {
            ...rest,
            storyId: story_id,
            title: "New Chapter",
            slug: newSlug,
            sn: (story?._count.chapters ?? -1) + 1,
          },
        });

        return chapter.slug;
      } catch (err) {
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
        await ctx.db.chapter.update({
          where: { id: input.id },
          data: {
            published: input.published,
          },
        });

        return true;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to change visibility",
        });
      }
    }),

  updateChapterIndex: privateProcedure
    .input(
      z.array(
        z.object({
          id: z.string(),
          sn: z.number(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const chapters = await ctx.db.chapter.findMany({
          where: {
            id: {
              in: input.map((c) => c.id),
            },
          },
          select: {
            id: true,
            sn: true,
          },
        });

        const sortedChapters = input.map((c) => {
          const chapter = chapters.find((ch) => ch.id === c.id);

          if (!chapter) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Chapter not found",
            });
          }

          return {
            id: c.id,
            sn: c.sn,
          };
        });

        const updatedChapters = await ctx.db.$transaction(
          sortedChapters.map((c) =>
            ctx.db.chapter.update({
              where: { id: c.id },
              data: { sn: c.sn },
            }),
          ),
        );

        return updatedChapters;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update chapter index",
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
            userId: ctx.session.user.id,
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
        const shouldIncrement = ctx.session.user.id !== chapter.story.authorId;

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
              userId: ctx.session.user.id,
            },
            create: {
              userId: ctx.session.user.id,
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
              where: { id: ctx.session.user.id },
            },
          },
        });

        if (!chapter) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Chapter not found",
          });
        }

        if (chapter.story.authorId === ctx.session.user.id) {
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
                  some: { id: ctx.session.user.id },
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
        const userProfile = await ctx.db.user.findUnique({
          where: { id: ctx.session.user.id },
          select: { coins: true },
        });

        if (!userProfile || userProfile.coins < calculateTotalCoins) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Insufficient coins to unlock chapter(s)",
          });
        }

        const unlock = await ctx.db.user.update({
          where: { id: ctx.session.user.id },
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
