import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";



export const productRouter = createTRPCRouter({
    createProduct: protectedProcedure
    .input(z.object({ userId:z.string(), name: z.string(), description: z.string(), price: z.number(), categories: z.array(z.string()) }))
    .mutation( async ({input: {userId:userId ,name:name, description:description, price:price, categories:categories}, ctx}) => {
        const newProduct = await ctx.db.product.create({data:{
            name: name,
            popularity: 1,
            price: price,
            categories: categories,
            description: description,
            ownerId: userId,
        }})
        return newProduct.id
    }),
    createProductImages: protectedProcedure
    .input(z.object({productId:z.string(), url:z.string()}))
    .mutation( async ({input : {url:url, productId:productId}, ctx}) => {
        await ctx.db.productImage.create({
            data: {
                url:url,
                productId: productId
            }})
    }),
    getProductsByUserId: publicProcedure
    .input(z.object({userId: z.string()}))
    .query( async ({input: { userId: userId }, ctx}) => {
        if (userId === "") return null
        const products = await ctx.db.product.findMany({
            where: {
                ownerId: userId,
            }, select: {
                id:true,
                categories:true,
                description:true,
                price:true,
                name:true,
                images:true,
                popularity:true,
                isApproved:true,
            },
        })
        return products
    }),
    getPopular: publicProcedure
    .query(async ({ctx}) => {
        const popularProduct = await ctx.db.product.findMany({
            orderBy: {
                favourited: {_count: "desc"}
            },                              
            take: 20,
            where: {
                isApproved: true
            },
            select: {
                id:true,
                categories:true,
                description:true,
                price:true,
                name:true,
                images:true,
                popularity:true,
                isApproved:true,
            }                                
        })
        return popularProduct
    }),
    getProductById: publicProcedure
    .input(z.object({productId: z.string()}))
    .query( async ({input: {productId: productId}, ctx}) => {
        if (productId == "") return null
        const product = await ctx.db.product.findUnique({
            where: {
                id: productId
            }, select: {
                id: true,
                images: true,
                isApproved: true,
                name: true,
                description:true,
                ownerId: true,
                categories: true,
                price: true,
                popularity: true,
                characteristics:true,
            }
        })
        return product
    }),
    addToFavourite: protectedProcedure
    .input(z.object({name: z.string(), productId: z.string()}))
    .mutation( async ({input: {name: name, productId: productId}, ctx}) => {
        if (name == "") return null
        if (productId == "" ) return null
        const data = { productId: productId, userName: name }
        const existingFavourite = await ctx.db.favourite.findUnique({
            where: { userName_productId: data }
        })
        
        const product = await ctx.db.product.findUnique({ where: {id: productId}, select: {popularity: true } })

        if (existingFavourite == null) {
            await ctx.db.favourite.create({data})
            await ctx.db.product.update({ where: {id: productId}, data: { popularity: (product?.popularity ?? 0) + 5 } })
            return { addedFavourite: true }
        } else {
            await ctx.db.favourite.delete({where: {userName_productId: data}})
            await ctx.db.product.update({ where: {id: productId}, data: { popularity: (product?.popularity ?? 0) - 5 } })
            return { addedFavourite: false }
        }
        
    }),
    findExistingFavourite: protectedProcedure
    .input(z.object({name: z.string(), productId: z.string()}))
    .query( async ({input: {name: name, productId: productId}, ctx}) => {
        if (name == "") return null
        if (productId == "" ) return null
        const data = { productId: productId, userName: name }
        const existingFavourite = await ctx.db.favourite.findUnique({
            where: { userName_productId: data }
        })
        return  existingFavourite != null ? true : false 
    }),
    CountFavourites: publicProcedure
    .input(z.object({productId: z.string()}))
    .query( async ({input: {productId: productId}, ctx}) => {
        if (productId == "" ) return null
        const FavouriteCount = await ctx.db.favourite.findMany({
            where: {
                productId: productId
            }
        })
        return FavouriteCount.length
    }),
    getProducts: publicProcedure
    .input(z.object({ page: z.number(), query: z.string(), favourite: z.boolean(), userName: z.optional(z.string())}))
    .query( async ({input: {page:page, query: query, favourite:favourite, userName: userName }, ctx}) => {
        const skip = (page - 1) * 10

        if (query === "" && favourite == false ) {
            const products = await ctx.db.product.findMany({ 
                where: {
                    isApproved: true,

                },
                take: 10,
                skip: skip,
                select: {
                    id: true,
                    images: true,
                    isApproved: true,
                    name: true,
                    categories: true,
                    price: true,
                },
                orderBy: {
                    favourited: {
                        _count: "desc"
                    }
                }
                
            })
            if (products.length > 0) { return {products, hasMore: true} }
            return { products, hasMore: false }

        } else if (favourite == true && query ==="") {
            const products = await ctx.db.product.findMany({ 
                where: {
                    isApproved: true,
                    favourited: {
                        some: {
                           userName: userName,
                           AND: {
                            userName: {
                                equals: userName
                            }
                           }
                        }
                    },
                },
                take: 10,
                skip: skip,
                select: {
                    id: true,
                    images: true,
                    isApproved: true,
                    name: true,
                    description:true,
                    ownerId: true,
                    categories: true,
                    price: true,
                    popularity: true,
                },
                orderBy: {
                    favourited: {
                        _count: "desc"
                    }
                }
                
            })
            if (products.length > 0) { return {products, hasMore: true} }
            return { products, hasMore: false }
        }
        const products = await ctx.db.product.findMany({ 
            where: {
                isApproved: true,
                name: {
                    contains: query,
                    mode: "insensitive"
                }},
            take: 10,
            skip: skip,
            select: {
                id: true,
                images: true,
                isApproved: true,
                name: true,
                description:true,
                ownerId: true,
                categories: true,
                price: true,
                popularity: true,
            }
        })
        if (products.length > 0) { return {products, hasMore: true} }
            return { products, hasMore: false }
    }),
    deleteProduct: protectedProcedure
    .input(z.object({productId: z.string()}))
    .mutation( async ({input: {productId: productId}, ctx}) => {
        
        await ctx.db.product.delete({where: {id: productId}})
        return "Successfully deleted"
    }),
    createCharacteristic: protectedProcedure
    .input(z.object({productId: z.string(), key: z.string(), value: z.string()}))
    .mutation( async ({input: {productId:productId, key:key, value:value }, ctx}) => {
        await ctx.db.characteristic.create({
            data: {
                key: key,
                value: value,
                productId: productId
            }
        })
    })
})



