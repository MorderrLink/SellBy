import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";


export const seenRouter = createTRPCRouter({
    newSeen: protectedProcedure
    .input(z.object({userId: z.string(), productId: z.string()}))
    .mutation( async ({input: {userId:userId, productId:productId}, ctx}) => {
        const existingSeen = await ctx.db.seens.findUnique({
            where: {
                userId_productId: {
                    userId: userId,
                    productId: productId,
                  },
            }
        })

        if (existingSeen == null) {
            await ctx.db.seens.create({
                data: {
                    userId: userId,
                    productId: productId,
                }
            })
            const product = await ctx.db.product.findUnique({where : { id: productId }, select: {popularity: true}})
            await ctx.db.product.update({ where: { id: productId }, data: { popularity : (product?.popularity ?? 0) + 1} })

            return { seen: "Added" }
        }
        return { seen : "Already exsists" }
    })
})