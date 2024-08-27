import { exampleRouter } from "~/server/api/routers/example";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { chapterRouter } from "./routers/chapter";
import { commentsRouter } from "./routers/comment";
import { feedbackRouter } from "./routers/feedback";
import { genreRouter } from "./routers/genre";
import { helpersRouter } from "./routers/helpers";
import { storyRouter } from "./routers/story";
import { stripeRouter } from "./routers/stripe";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  story: storyRouter,
  chapter: chapterRouter,
  helpers: helpersRouter,
  auth: authRouter,
  feedback: feedbackRouter,
  genre: genreRouter,
  comments: commentsRouter,
  stripe: stripeRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
