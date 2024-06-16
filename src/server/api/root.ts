import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { chapterRouter } from "./routers/chapter";
import { storyRouter } from "./routers/story";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  story: storyRouter,
  chapter: chapterRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
