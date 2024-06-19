import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { chapterRouter } from "./routers/chapter";
import { helpersRouter } from "./routers/helpers";
import { storyRouter } from "./routers/story";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  story: storyRouter,
  chapter: chapterRouter,
  helpers: helpersRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
