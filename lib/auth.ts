import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware, APIError } from "better-auth/api";

const prisma = new PrismaClient();

const ALLOWED_EMAILS = [
  "ed@bluepearl.ca",
  "miko@bluepearlmortgage.ca",
  "nitesh@bluepearlmortgage.ca",
  "veetesh@bluepearl.ca",
];

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
  plugins: [nextCookies()],
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // Block sign-up for non-allowed emails
      if (ctx.path === "/sign-up/email") {
        const email = ctx.body?.email?.toLowerCase();
        if (!email || !ALLOWED_EMAILS.includes(email)) {
          throw new APIError("BAD_REQUEST", {
            message: "This email is not authorized to sign up.",
          });
        }
      }
    }),
  },
});

export type Session = typeof auth.$Infer.Session;
