import { router, publicProcedure, protectedProcedure } from "./server";

export const appRouter = router({
  // Public procedure - anyone can call
  healthCheck: publicProcedure.query(() => {
    return { status: "ok" };
  }),

  // Protected procedure - only authenticated users
  getDashboardData: protectedProcedure.query(async ({ ctx }) => {
    // Only authenticated users reach here
    return {
      user: ctx.session.user,
      message: `Welcome, ${ctx.session.user.name}!`,
    };
  }),

  // Get current user info
  getUser: protectedProcedure.query(async ({ ctx }) => {
    return ctx.session.user;
  }),
});

export type AppRouter = typeof appRouter;
