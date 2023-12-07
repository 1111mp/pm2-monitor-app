import { createTRPCRouter } from "@/server/api/trpc";
import { pm2Router } from "@/server/api/routers/pm2";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  pm2: pm2Router,
});

// export type definition of API
export type AppRouter = typeof appRouter;
