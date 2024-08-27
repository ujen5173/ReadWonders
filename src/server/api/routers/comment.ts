import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";

export const commentsRouter = createTRPCRouter({
  test: publicProcedure.query(() => {
    return "Hello, world!";
  }),

  addStoryComment: privateProcedure
    .input(
      z.object({
        content: z.string().min(1).max(255),
        storyId: z.string().uuid(),
        commentId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { content, storyId } = input;

      try {
        const commentId = await ctx.db.comment.create({
          data: {
            content,
            storyId,
            parentId: input.commentId,
            userId: ctx.session.user.id,
          },
        });

        if (commentId) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create comment",
        });
      }
    }),

  getAll: publicProcedure
    .input(
      z.object({
        storyId: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const comments = await ctx.db.comment.findMany({
          where: {
            storyId: input.storyId,
            parent: null,
          },

          select: {
            id: true,
            content: true,
            user: {
              select: {
                id: true,
                username: true,
                profile: true,
              },
            },
            _count: {
              select: {
                children: true,
              },
            },
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        const result = comments.map(({ _count, ...rest }) => ({
          ...rest,
          childrenCount: _count.children,
          children: [],
        }));

        return result;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not fetch comments",
        });
      }
    }),

  getReplies: publicProcedure
    .input(
      z.object({
        commentId: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const replies = await ctx.db.comment.findMany({
          where: {
            parentId: input.commentId,
          },

          select: {
            id: true,
            content: true,
            user: {
              select: {
                id: true,
                username: true,
                profile: true,
              },
            },
            _count: {
              select: {
                children: true,
              },
            },
            createdAt: true,
          },
        });

        const result = replies.map(({ _count, ...rest }) => ({
          ...rest,
          childrenCount: _count.children,
          children: [],
        }));

        return result;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not fetch replies",
        });
      }
    }),
});
