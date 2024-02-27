import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    getUserByName: publicProcedure
    .input(z.object({name: z.string()}))
    .query(async ({input: {name: name}, ctx}) => {
        if (name == "undefined") return null
        const user = await ctx.db.user.findUnique({
            where: {
            name: name
            },
            select: {
            name: true,
            id: true,
            email: true,
            image: true,
        }})
        return user
    }),
    changeUserProfile: protectedProcedure
    .input(z.object({name: z.string(), image: z.string(), newName: z.string() }))
    .mutation(async ({input: {name: name, image: image, newName:newName}, ctx}) => { 
        try { 

            if (newName === "" && image == "") {
                return "Empty data"
            } else if (newName === "" && image !== "") {
                await ctx.db.user.update({where: {name: name}, data: {
                    image: image,
                }})

            } else if (newName !== "" && image === "") {
                await ctx.db.user.update({where: {name: name}, data: {
                    name: newName
                }})
            } else {
                await ctx.db.user.update({where: {name: name}, data: {
                    name: newName,
                    image: image
                }})
            }

            

        } catch (error) {
            return error
        } finally {
            return "Success"
        }
        
     })
});


