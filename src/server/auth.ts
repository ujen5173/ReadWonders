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
  session: {
    strategy: "jwt",
  },
  secret: env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.profile = user.profile;
        token.username = user.username;
      }
      return token;
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          id: token.id,
          name: token.name,
          email: token.email,
          profile: token.profile,
          emailVerified: token.emailVerified,
          username: token.username,
        },
      };
    },
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
          const maxAttempts = 10; // Add a maximum number of attempts
          let attempts = 0;
          while (isUsernameExists(username) && attempts < maxAttempts) {
            username = `${desiredUsername}${generateRandomNumber()}${suffix}`;
            suffix++;
            attempts++;
          }
          if (attempts === maxAttempts) {
            // Handle the case when a unique username couldn't be generated
            username = `${desiredUsername}_${Date.now()}`;
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
