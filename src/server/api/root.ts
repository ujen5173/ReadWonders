import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { chapterRouter } from "./routers/chapter";
import { feedbackRouter } from "./routers/feedback";
import { helpersRouter } from "./routers/helpers";
import { storyRouter } from "./routers/story";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  story: storyRouter,
  chapter: chapterRouter,
  helpers: helpersRouter,
  auth: authRouter,
  feedback: feedbackRouter,
});

export type AppRouter = typeof appRouter;
