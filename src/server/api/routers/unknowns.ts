import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";


export const unknownRouter = createTRPCRouter({
    createNewVisitor: publicProcedure
    .input(z.object({ ip: z.string() }))
    .mutation( async ({input: {ip:ip}, ctx}) => {
        const existingVisitor = await ctx.db.visitor.findUnique({
            where: {
                ip: ip
            }
        })
        if (existingVisitor == null) {
            await ctx.db.visitor.create({
                data: {
                    ip: ip
                }
            })
        }
        return "new visitor"
    })
})