import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";


export const orderRouter = createTRPCRouter({
    createOrder: protectedProcedure
    .input(z.object({userId: z.string()}))
    .mutation( async ({input: {userId: userId}, ctx}) => {


        const order = await ctx.db.order.create({
            data: {
                customerId: userId
            }
        })
        return order.id
    }),
    addOrderItem: protectedProcedure
    .input(z.object({ orderId:z.string(), productId: z.string(), quantity: z.number(), price:z.number() }))
    .mutation( async ({input: { orderId: orderId, productId: productId, quantity: quantity }, ctx}) => {
        await ctx.db.orderItem.create({
            data: { 
                orderId: orderId, 
                productId: productId, 
                quantity: quantity
            }
        })
        const product = await ctx.db.product.findUnique({
            where: {
                id: productId
            },
            select: {
                popularity: true
            }
        })
        await ctx.db.product.update({
            where: {
                id: productId
            },
            data: {
                popularity: (product?.popularity ?? 0) + 10
            }
        })
        const orderItems = await ctx.db.orderItem.findMany({
            where: {
                orderId: orderId
            },
            select: {
                quantity: true,
                product: { 
                    select: {
                        price: true
                    }
                }
            }
        })
        let finalPrice = 0
        orderItems.map(item => {
            finalPrice = finalPrice + (item.quantity*item.product.price)
        })

        await ctx.db.order.update({
            where: {
                id: orderId
            },
            data: {
                totalPrice: finalPrice
            }
        })
        finalPrice = 0
    }),
    getOrdersByUserId: protectedProcedure
    .input(z.object({userId: z.string()}))
    .query( ({input: {userId:userId}, ctx}) => {
        if (userId == "") return
        return ctx.db.order.findMany({
            where: {
                customerId: userId
            },
            select: {
                updatedAt:true,
                customer: {
                    select: {
                        name: true
                    }
                },
                totalPrice: true,
                id: true,
                products: {
                    
                    select: {
                        quantity: true,
                        product: {
                            select: {
                                name: true,
                                categories: true,
                                images: true,
                                price: true,
                            }
                        }
                    }
                },
                
            },
            orderBy: {
                updatedAt: "desc"
            }
        })
    }),
    getOrder: protectedProcedure
    .input(z.object({orderId: z.string()}))
    .query( async ({input: {orderId:orderId}, ctx}) => {
        return await ctx.db.order.findUnique({
            where: {
                id: orderId
            },
            select: {
                updatedAt: true,
                totalPrice: true,
                customer: {
                    select: {
                        name: true
                    }
                },
                products: {
                    select: { 
                        quantity: true,
                        product: {
                            select: {
                                price:true,
                                name: true,
                                images: {
                                    select: {
                                        url: true
                                    }
                                },
                            }
                        }
                    }
                }
            }
        })
    })
})