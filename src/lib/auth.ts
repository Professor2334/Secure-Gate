import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/schemas";
import { checkRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Rate Limiting by Client IP
        const headersList = headers();
        const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
        const rateLimitCheck = await checkRateLimit(ip, "login");

        if (!rateLimitCheck.success) {
          throw new Error("Too many login attempts. Please try again in 10 minutes.");
        }

        const validatedFields = LoginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          throw new Error("Invalid credentials format");
        }

        const { email, password } = validatedFields.data;

        // Query user by email
        const user = await prisma.user.findUnique({
          where: { email },
        });

        // Use generic auth error messages to prevent account existence disclosures
        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        // Compare password hash
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.emailVerified = user.emailVerified;
      } else {
        // Query database to fetch the latest emailVerified status
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { emailVerified: true },
        });
        if (dbUser) {
          token.emailVerified = dbUser.emailVerified;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.emailVerified = token.emailVerified;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
