import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { sendEmail } from "./email";

const prisma = new PrismaClient();

const ALLOWED_EMAILS = [
  "ed@bluepearl.ca",
  "miko@bluepearlmortgage.ca",
  "nitesh@bluepearlmortgage.ca",
  "veetesh@bluepearl.ca",
  "edward@buildlaunchiterate.ca",
];

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email - Pipeline Dashboard",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to Pipeline Dashboard!</h2>
            <p style="color: #666; font-size: 16px;">
              Click the button below to verify your email address:
            </p>
            <a href="${url}"
               style="display: inline-block; background-color: #0070f3; color: white;
                      padding: 12px 24px; text-decoration: none; border-radius: 6px;
                      font-weight: 500; margin: 16px 0;">
              Verify Email
            </a>
            <p style="color: #999; font-size: 14px;">
              This link expires in 24 hours. If you didn't create an account, you can ignore this email.
            </p>
            <p style="color: #999; font-size: 12px;">
              Or copy and paste this link: ${url}
            </p>
          </div>
        `,
        text: `Welcome to Pipeline Dashboard! Verify your email by clicking: ${url}`,
      });
    },
  },
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
