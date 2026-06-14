import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

const demoUsers = {
  "demo@company.com": {
    id: "demo-company",
    email: "demo@company.com",
    name: "Rajesh Kumar",
    role: "COMPANY",
    avatar: "🏢",
  },
  "demo@partner.com": {
    id: "demo-partner",
    email: "demo@partner.com",
    name: "Asha Mehta",
    role: "COMPANY",
    avatar: "🛠️",
  },
  "demo@user.com": {
    id: "demo-user",
    email: "demo@user.com",
    name: "Demo Customer",
    role: "USER",
    avatar: "👤",
  },
} as const;

export const authOptions: NextAuthConfig = {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "dev-secret-change-me",
  trustHost: true,
  adapter: process.env.DATABASE_URL ? PrismaAdapter(prisma) : undefined,
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // Always allow demo users (works locally and on Vercel)
        const fallbackUser = demoUsers[credentials.email as keyof typeof demoUsers];
        if (
          fallbackUser &&
          typeof credentials.password === "string" &&
          credentials.password === "demo123"
        ) {
          return fallbackUser;
        }

        // Real database login
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user || !user.passwordHash) {
            throw new Error("Invalid credentials");
          }

          const isCorrectPassword = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash,
          );

          if (!isCorrectPassword) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
          };
        } catch {
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as { id: string; role?: string };
        token.id = authUser.id;
        token.role = authUser.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const user = session.user as unknown as { id?: string; role?: string };
        user.id = token.id as string;
        user.role = token.role as string;
      }

      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
