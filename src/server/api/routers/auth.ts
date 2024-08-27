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
import { type FollowersData, type FollowingData } from "~/types";

export const authRouter = createTRPCRouter({
  authInfo: publicProcedure.query(async ({ ctx }) => {
    return ctx.session?.user ?? null;
  }),

  getSubscriptionStatus: privateProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findFirst({
      where: {
        id: ctx?.session?.user?.id,
      },
      select: {
        stripeSubscriptionStatus: true,
      },
    });

    return user?.stripeSubscriptionStatus ?? false;
  }),

  getProfile: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user.id;
    if (!userId) return null;

    const user = await ctx.db.user.findFirstOrThrow({
      where: {
        id: userId,
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
    const user = await ctx.db.user.findFirst({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        id: true,
        username: true,
        name: true,
        profile: true,
        bio: true,
        tagline: true,
        email: true,
        website: true,
        twitter: true,
        goodreads: true,
        wattpad: true,
      },
    });

    return user;
  }),

  userProfile: publicProcedure
    .input(
      z.object({
        username: z.string(),
        identity: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx?.session?.user?.id;

      try {
        const userDetails = await ctx.db.user.findFirst({
          where: {
            ...(input.identity === "id"
              ? { id: input.username }
              : {
                  username: input.username,
                }),
          },
          include: {
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
            story: {
              take: limit,
              include: {
                readingLists: userId
                  ? {
                      where: {
                        authorId: userId,
                      },
                      select: {
                        id: true,
                      },
                    }
                  : false,
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
                    isPremium: true,
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

        if (!userDetails) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Uh-oh! User Hasn't Logged Into Life Yet",
          });
        }

        return {
          ...userDetails,
          story:
            userDetails?.story.map((story) => ({
              ...story,
              readingList: (story.readingLists ?? []).length > 0,
            })) ?? [],
        };
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }

        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tech Glitch! Server's Taking a Nap",
        });
      }
    }),

  follow: privateProcedure
    .input(
      z.object({
        authorId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { authorId } = input;
        const followerId = ctx.session.user.id;

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
              ctx.db.user.update({
                where: { id: followerId },
                data: { followingCount: { decrement: 1 } },
              }),
              ctx.db.user.update({
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
              ctx.db.user.update({
                where: { id: followerId },
                data: { followingCount: { increment: 1 } },
              }),
              ctx.db.user.update({
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
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }

        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tech Glitch! Server's Taking a Nap",
        });
      }
    }),

  currentReads: privateProcedure
    .input(
      z.object({
        limit: z.number().default(limit),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const currentReads = await ctx.db.currentReads.findFirst({
          where: {
            userId: ctx?.session?.user?.id, // Make this optional to handle unauthenticated users
          },
          select: {
            id: true,
            stories: {
              select: TCardSelect(ctx?.session?.user?.id),
              orderBy: {
                createdAt: "desc",
              },
              take: input.limit,
            },
          },
        });

        // Process the result to add the readingList flag
        const processedStories =
          currentReads?.stories.map((story) => ({
            ...story,
            readingList: (story.readingLists ?? []).length > 0,
          })) ?? [];

        return processedStories;
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tech Glitch! Server's Taking a Nap",
        });
      }
    }),

  readingLists: publicProcedure
    .input(
      z.object({
        limit: z.number().default(6),
        authorId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const id = input.authorId ?? ctx?.session?.user?.id;
        const readingLists = await ctx.db.readingList.findMany({
          take: input.limit,
          where: {
            authorId: id,
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
        if (err instanceof TRPCError) {
          throw err;
        }

        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tech Glitch! Server's Taking a Nap",
        });
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
        if (err instanceof TRPCError) {
          throw err;
        }

        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tech Glitch! Server's Taking a Nap",
        });
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
        const newSlug = slugify(input.title + input.readingListId, slugy);

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
        if (err instanceof TRPCError) {
          throw err;
        }

        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tech Glitch! Server's Taking a Nap",
        });
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
        twitter: z.string().optional().nullable(),
        wattpad: z.string().optional().nullable(),
        website: z.string().url().optional().nullable(),
        goodreads: z.string().url().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const usernameTaken = await ctx.db.user.findFirst({
          where: {
            username: input.username,
            id: {
              not: ctx.session.user.id,
            },
          },
        });

        if (usernameTaken) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Username is already taken",
          });
        }

        const user = await ctx.db.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: input,
        });

        return user;
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }

        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tech Glitch! Server's Taking a Nap",
        });
      }
    }),

  readingListNames: privateProcedure.query(async ({ ctx }) => {
    const readingListNames = await ctx.db.readingList.findMany({
      where: {
        authorId: ctx?.session?.user?.id,
      },
      select: {
        id: true,
        title: true,
      },
    });

    return readingListNames;
  }),

  followData: publicProcedure
    .input(
      z.object({
        username: z.string(),
        limit: z.number().optional().default(limit),
        type: z.enum(["followers", "following"]),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const user = (await ctx.db.user.findFirst({
          where: {
            username: input.username,
          },
          select:
            input.type === "followers"
              ? {
                  followersCount: true,
                  followers: {
                    take: input.limit,
                    select: {
                      following: {
                        select: {
                          id: true,
                          username: true,
                          profile: true,
                          name: true,
                        },
                      },
                    },
                  },
                }
              : {
                  followingCount: true,
                  following: {
                    take: input.limit,
                    select: {
                      follower: {
                        select: {
                          id: true,
                          username: true,
                          profile: true,
                          name: true,
                        },
                      },
                    },
                  },
                },
        })) as FollowersData | FollowingData | null;

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        if (input.type === "followers") {
          return (user as FollowersData).followers.map((e) => e.following);
        } else {
          return (user as FollowingData).following.map((e) => e.follower);
        }
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }

        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tech Glitch! Server's Taking a Nap",
        });
      }
    }),
});
