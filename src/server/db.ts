import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

import { env } from "~/env.mjs";

const prismaClientSingleton = () => {
  return new PrismaClient({}).$extends(withAccelerate());
};

export type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const db =
  globalForPrisma.prisma ?? new PrismaClient({}).$extends(withAccelerate());

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
