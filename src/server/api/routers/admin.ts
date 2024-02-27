import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";


export const adminRouter = createTRPCRouter({
    getUsers: publicProcedure
    .input(z.object({page: z.number()}))
    .query(async ({input: { page:page},ctx}) => {
        const skip = (page - 1) * 10

        const users = await ctx.db.user.findMany({
            where: {
                isAdmin: false,
            },
            select: {
                name: true,
                image: true,
            },
            take: 10,
            skip: skip
        })

        if (users.length > 0) return {users, hasMore: true}
        return {users, hasMore: false}
    }),
    getProducts: publicProcedure
    .input(z.object({page: z.number()}))
    .query( async ({input: {page:page}, ctx}) => {
        const skip = (page - 1) * 10

        const products = await ctx.db.product.findMany({
            where: {
                isApproved: true
            },
            take: 10,
            skip: skip,
            select: {
                name: true,
                price: true,
                images: true,
                owner: {
                    select: {
                        name: true,
                        image: true,
                    }
                },
                categories: true,
                id: true
            },
            orderBy: {
                popularity: "desc"
            }
        })
        if (products.length > 0) return {products, hasMore: true}
        return {products, hasMore: false}
    }),
    getApproval: publicProcedure
    .input(z.object({page: z.number()}))
    .query( async ({input: {page:page}, ctx}) => {
        const skip = (page - 1) * 10

        const products = await ctx.db.product.findMany({
            where: {
                isApproved: false
            },
            take: 10,
            skip: skip,
            select: {
                name: true,
                price: true,
                images: true,
                owner: {
                    select: {
                        name: true,
                        image: true,
                    }
                },
                categories: true,
                id: true
            },
            orderBy: {
                popularity: "desc"
            }
        })
        if (products.length > 0) return {products, hasMore: true}
        return {products, hasMore: false}
    }),
    approveProduct: publicProcedure
    .input(z.object({productId: z.string()}))
    .mutation( async ({input: {productId:productId}, ctx}) => {
        await ctx.db.product.update({
            where: {
                id: productId
            },
            data: {
                isApproved: true
            }
        })
    })
})