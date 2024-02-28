
import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { productRouter } from "./routers/product";
import { orderRouter } from "./routers/order";
import { adminRouter } from "./routers/admin";
import { seenRouter } from "./routers/seen";
import { unknownRouter } from "./routers/unknowns";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  product: productRouter,
  order: orderRouter,
  admin: adminRouter,
  seen: seenRouter,
  unknowns: unknownRouter, 
});

// export type definition of API
export type AppRouter = typeof appRouter;
