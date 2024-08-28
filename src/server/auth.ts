import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
  type User,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import GoogleProvider, { type GoogleProfile } from "next-auth/providers/google";
import slugify from "slugify";
import { env } from "~/env";
import { db } from "~/server/db";
import { slugy } from "./constants";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      email: string;
      profile: string;
      emailVerified: boolean;
      username: string;
    };
  }

  interface User {
    username: string;
    hasPremium: boolean;
    coins: number;
    profile: string;
    isSubscribed: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/signin",
  },
  secret: env.NEXTAUTH_SECRET,
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        emailVerified: user.emailVerified,
        username: user.username,
      },
    }),
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_SECRET,
      async profile(profile: GoogleProfile): Promise<User> {
        const usernameOccurance = await db.user.findMany({
          where: {
            username: {
              startsWith: slugify(profile.name, {
                ...slugy,
                replacement: "_",
              }),
            },
          },
        });
        const isUsernameExists = (username: string): boolean => {
          return usernameOccurance.some((user) => user.username === username);
        };
        // Function to generate a random number
        const generateRandomNumber = () => {
          return Math.floor(Math.random() * 10);
        };
        // Function to generate a unique username
        const generateUniqueUsername = (desiredUsername: string): string => {
          let username = desiredUsername;
          let suffix = 1;
          while (isUsernameExists(username)) {
            username = `${desiredUsername}${generateRandomNumber()}${suffix}`;
            suffix++;
          }
          return username;
        };

        return {
          id: profile.sub,
          name: profile.name,
          username: generateUniqueUsername(
            slugify(profile.name, {
              ...slugy,
              replacement: "_",
            }),
          ),
          profile: profile.picture,
          coins: 0,
          hasPremium: false,
          isSubscribed: false,
          email: profile.email,
        };
      },
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
