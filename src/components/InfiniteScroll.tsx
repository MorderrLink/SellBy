
import React, { useEffect, useRef, useState } from "react"
import { api } from "~/utils/api"
import ProductCard from "./Card"
import { useSearchParams } from "next/navigation"
import ProductsFallbackComponent from "./ProductsFallbackComponent"


type customImageProps = {
    id: string;
    url: string;
    productId: string;
}

type Product = {
    id: string;
    name: string;
    images: customImageProps[];
    price: number;
    description: string | null;
    popularity: number;
    isApproved: boolean;
    categories: string[];
    ownerId: string;
   };

   export default function InfiniteScroll({favourite, userName, category}: {favourite: boolean, userName?: string, category?:string}) {
    const categoryFilter = (category == null || category?.length ==  0) ? "all" : category;
    const [page, setPage] = useState(1)
    const loader = useRef(null)
    const [products, setProducts] = useState<Product[] | []>([])
    const query = useSearchParams().get("q")
    const { data: productsData, isLoading } = api.product.getProducts.useQuery({
        favourite: favourite,
        userName: userName,
        page: page,
        query: query ?? "",
    })

    useEffect(() => {
        setPage(1)
        setProducts([])
    }, [])

    useEffect(() => {
        setPage(1)
        setProducts([])
    }, [query])


    useEffect(() => {
        if (productsData && productsData.hasMore && !isLoading) {
            setProducts(prev => [...prev, ...productsData.products])
        }       
    }, [productsData, isLoading])
 
    const loadMoreItems = () => {
        if (productsData?.hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };
 
    useEffect(() => {
        if (!isLoading && loader.current && productsData?.hasMore) {
            const options = {
                root: null,
                rootMargin: '0px',
                threshold: 1.0
            };
            
            const observer = new IntersectionObserver(handleObserver, options);
            observer.observe(loader.current);
            return () => {
                if (loader.current) {
                 observer.unobserve(loader.current);
                }
            };
        }
    }, [isLoading]);
 
    const handleObserver = (entities:any, observer:any) => {
        const target = entities[0];
        if (target.isIntersecting) {
          loadMoreItems();
        }
    };
 
    return (
        <div className="w-full flex flex-row  items-center justify-center flex-wrap gap-4 lg:gap-5 pt-0 ">
            
            { products.map(product => {
                if (categoryFilter == "all") {
                    return (
                        <ProductCard {...product} key={product.id}/>   
                    )
                }  
                if (product.categories.includes(categoryFilter)) {
                    return (
                        <ProductCard {...product} key={product.id}/>   
                    )
                }
                
                })
            }
            {isLoading && <ProductsFallbackComponent/>}
            <div ref={loader}></div>
            {!isLoading && products.length == 0 && <div>Nothing matches you query</div>}
        </div>
    )
 }


 