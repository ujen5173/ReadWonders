import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { bookRouter } from "./routers/book";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  book: bookRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
