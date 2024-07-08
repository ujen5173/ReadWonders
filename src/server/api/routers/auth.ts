import { TRPCError } from "@trpc/server";
import slugify from "slugify";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { limit, slugy } from "~/server/constants";
import { TCardSelect } from "~/server/constants/db";

export const authRouter = createTRPCRouter({
  authInfo: publicProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),

  getProfile: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return null;

    const user = await ctx.db.profiles.findFirstOrThrow({
      where: {
        id: ctx.user.id,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        profile: true,
      },
    });

    return user;
  }),

  me: privateProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.profiles.findFirst({
      where: {
        id: ctx.user.id,
      },
      select: {
        id: true,
        username: true,
        name: true,
        profile: true,
        bio: true,
        tagline: true,
        email: true,
      },
    });

    return user;
  }),

  bookmark: privateProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const story = await ctx.db.story.findFirst({
        where: {
          slug: input.slug,
        },
      });

      if (!story) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Story not found",
        });
      }

      const bookmark = await ctx.db.bookmark.findFirst({
        where: {
          userId: ctx.user.id,
          storyId: story.id,
        },
      });

      if (bookmark) {
        await ctx.db.bookmark.delete({
          where: {
            id: bookmark.id,
          },
        });

        return {
          action: "removed",
          storyId: story.id,
        };
      } else {
        await ctx.db.bookmark.create({
          data: {
            userId: ctx.user.id,
            storyId: story.id,
          },
        });
      }

      return {
        action: "added",
        storyId: story.id,
      };
    }),

  userProfile: publicProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userDetails = await ctx.db.profiles.findFirst({
        where: {
          username: input.username,
        },
        include: {
          followers:
            ctx.user?.id !== undefined
              ? {
                  select: {
                    id: true,
                  },
                  where: {
                    followingId: ctx.user?.id,
                  },
                }
              : false,
          story: {
            take: limit,
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
        },
      });

      return userDetails;
    }),

  follow: privateProcedure
    .input(
      z.object({
        authorId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { authorId } = input;
      const followerId = ctx.user.id;

      // Check if user is trying to follow themselves
      if (followerId === authorId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot follow or unfollow yourself",
        });
      }

      // Check if the follow relationship already exists
      const existingFollow = await ctx.db.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: authorId,
            followingId: followerId,
          },
        },
      });

      if (existingFollow) {
        // Unfollow logic
        const [deletedFollow, updatedFollower, updatedFollowing] =
          await ctx.db.$transaction([
            ctx.db.follow.delete({
              where: {
                id: existingFollow.id,
              },
            }),
            ctx.db.profiles.update({
              where: { id: followerId },
              data: { followingCount: { decrement: 1 } },
            }),
            ctx.db.profiles.update({
              where: { id: authorId },
              data: { followersCount: { decrement: 1 } },
            }),
          ]);

        return {
          action: "unfollowed",
          deletedFollow,
          updatedFollower,
          updatedFollowing,
        };
      } else {
        // Follow logic
        const [newFollow, updatedFollower, updatedFollowing] =
          await ctx.db.$transaction([
            ctx.db.follow.create({
              data: {
                followerId: authorId,
                followingId: followerId,
              },
            }),
            ctx.db.profiles.update({
              where: { id: followerId },
              data: { followingCount: { increment: 1 } },
            }),
            ctx.db.profiles.update({
              where: { id: authorId },
              data: { followersCount: { increment: 1 } },
            }),
          ]);

        return {
          action: "followed",
          newFollow,
          updatedFollower,
          updatedFollowing,
        };
      }
    }),

  currentReads: privateProcedure
    .input(
      z.object({
        limit: z.number().default(limit),
      }),
    )
    .query(async ({ ctx, input }) => {
      const currentReads = await ctx.db.currentReads.findFirst({
        take: input.limit,
        where: {
          userId: ctx.user.id,
        },
        select: {
          id: true,
          stories: {
            select: TCardSelect,
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      return currentReads?.stories ?? [];
    }),

  readingLists: publicProcedure
    .input(
      z.object({
        limit: z.number().default(6),
        authorId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const readingLists = await ctx.db.readingList.findMany({
          take: input.limit,
          where: {
            authorId: input.authorId,
          },
          select: {
            id: true,
            authorId: false,
            title: true,
            slug: true,
            description: true,
            private: false,
            createdAt: false,
            stories: {
              take: 3,
              select: {
                thumbnail: true,
              },
            },
          },
        });

        return readingLists;
      } catch (err) {
        throw new Error("Error fetching reading lists");
      }
    }),

  deleteReadingList: privateProcedure
    .input(
      z.object({
        readingListId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.readingList.delete({
          where: {
            id: input.readingListId,
          },
        });

        return true;
      } catch (err) {
        throw new Error("Error deleting reading list");
      }
    }),

  editReadingList: privateProcedure
    .input(
      z.object({
        readingListId: z.string(),
        title: z.string(),
        description: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const newSlug = slugify(input.title, slugy);

        await ctx.db.readingList.update({
          where: {
            id: input.readingListId,
          },
          data: {
            title: input.title,
            slug: newSlug,
            description: input.description,
          },
        });

        return true;
      } catch (err) {
        throw new Error("Error deleting reading list");
      }
    }),

  update: privateProcedure
    .input(
      z.object({
        username: z.string(),
        name: z.string(),
        email: z.string(),
        bio: z.string().nullable(),
        tagline: z.string().nullable(),
        profile: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const usernameTaken = await ctx.db.profiles.findFirst({
        where: {
          username: input.username,
          id: {
            not: ctx.user.id,
          },
        },
      });

      if (usernameTaken) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username is already taken",
        });
      }

      const user = await ctx.db.profiles.update({
        where: {
          id: ctx.user.id,
        },
        data: input,
      });

      return user;
    }),
});
