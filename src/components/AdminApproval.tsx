
import { useEffect, useRef, useState } from "react";
import { Input } from "~/components/ui/input";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { api } from "~/utils/api";
import Link from "next/link";
import { CiCircleInfo } from "react-icons/ci";
import DeleteDialog from "./DeleteDialog";
import { toast } from "sonner";
import AdminApproveSkeleton from "./ui/AdminApproveSkeleton";
import ImageModal from "./ui/ImageModal";
type ProductType = {
    name: string;
    id: string;
    price: number;
    categories: string[];
    images: {
        id: string;
        url: string;
        productId: string;
    }[];
    owner: {
        name: string;
        image: string | null;
    };
}
 



export default function AdminApproval() {
    const [products, setProducts] = useState<ProductType[] | undefined>([])
    const utils = api.useContext()
    const [inputState, setInputState] = useState("")
    const [filterProducts, setFilterProducts] = useState<ProductType[] | undefined>([])
    const [dataLoading, setDataLoading] = useState<boolean>(true)
    const loader = useRef(null)
    const [page, setPage] = useState(1)
    const productsData = api.admin.getApproval.useQuery({page: page}).data
    const approveMutation = api.admin.approveProduct.useMutation({
        onSuccess() {
            utils.admin.getApproval.invalidate()
            utils.admin.getProducts.invalidate()
        }
    })


    useEffect(() => {
        return () => {
            setProducts([]);
            setFilterProducts([]);
            setDataLoading(true);
            setPage(1);
        };
    }, []);


    useEffect(() => {
        
        if (productsData && productsData.products.length > 0 && productsData.hasMore ) {
            setProducts(prev => [...(prev || []), ...(Array.isArray(productsData.products) ? productsData.products : [])]);
            setDataLoading(false)
        }
    }, [productsData])

    useEffect(() => {
        
        setFilterProducts(() => {
            if (inputState == "") {
                return products
            }
            const productsToFilter = products
            const filtered = productsToFilter?.filter((product) => product.name.toLowerCase().includes(inputState.toLowerCase()));
            console.log("FILTER: ", inputState)
            console.log("Filtered products: ", filtered)
            return filtered;
        });
        
    }, [inputState, products])


    const loadMoreItems = () => {
        if (productsData?.hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };



    useEffect(() => {
        if (!dataLoading && loader.current && productsData?.hasMore) {
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
    }, [dataLoading]);
 
    const handleObserver = (entities:any, observer:any) => {
        const target = entities[0];
        if (target.isIntersecting) {
          loadMoreItems();
        }
    };


    const approveProduct = (id: string) => {
        approveMutation.mutate({
            productId: id
        }, { 
            onSuccess(){ 
                toast.success("Product approved")
                setFilterProducts((prev) => {
                    const productsToFilter = prev
                    const filtered = productsToFilter?.filter((product) => product.id != id);
            
                    return filtered;
                })
            }
        })

    }

    const handleDeleteSuccess = (deletedProductId: string) => {
        setFilterProducts(prev => prev?.filter(product => product.id != deletedProductId))
    }


  return (
    <div className="w-full flex flex-col justify-center items-center border-[1px] rounded-[7px] border-text-secondary-color p-[10px]  gap-5 pb-20">
        <Input  onChange={(e) => setInputState(e.currentTarget.value)} placeholder="Enter product title" className="border-[1px] border-text-secondary-color rounded-[10px]"/>
        <ScrollArea className="w-full h-full min-h-[350px] border-[1px] border-text-secondary-color rounded-[10px] max-w-full overflow-auto">
            {dataLoading ? <div className="w-full flex flex-row justify-start items-center p-2 gap-2">
                                <AdminApproveSkeleton/>
                                <AdminApproveSkeleton/> 
                                <AdminApproveSkeleton/> 
                                <AdminApproveSkeleton/> 
                                <AdminApproveSkeleton/> 
                                <AdminApproveSkeleton/> 
                                <AdminApproveSkeleton/> 
                                <AdminApproveSkeleton/>  
                                
                            </div>
                : <div className="w-full h-full flex flex-row justify-center items-center p-2 gap-2">
                {   !(filterProducts && filterProducts.length > 0) ? <div>
                        No Products Matching
                    </div>
                    : filterProducts?.map(product => {
                    return (
                        <div key={product.id} className="h-max w-[300px] flex flex-col  items-center gap-3 px-5 py-2 rounded-md border-[1px] border-nav-bg-color">
                            <h1 className="text-2xl font-medium">{ product.name.length > 15 ? product.name.slice(0, 15)+"..." : product.name }</h1>
                            <ImageModal imageSrc={product.images[0]?.url ?? ""} sizes="max-3xl">
                                <img src={product.images[0]?.url ?? ""} alt="product photo" className="w-16 h-16 ronded-lg aspect-square" />
                            </ImageModal>
                            <div className="flex flex-row gap-2">
                                {product.categories.map(category => {
                                    return <h1 key={category} className="border-[1px] border-text-secondary-color py-[2px] px-2 rounded-md bg-main-bg-color bg-opacity-25">{category}</h1>
                                })}
                            </div>
                            <h1>${product.price}</h1>
                            <div className="flex flex-row gap-4 items-center">

                                <h1 className="font-mono">Owner:</h1>
                                <img className="w-12 h-12 rounded-full" src={product.owner.image ?? ""} alt="" />
                                <h1 className="font-medium text-lg">{product.owner.name}</h1>
                            </div>
                            <div className="w-full flex flex-col gap-2 ">
                                <Link target="_blank" className="w-full flex flex-row gap-3 justify-center items-center border-[1px] border-text-secondary-color px-2 py-[2px] rounded-md hover:bg-main-bg-color hover:bg-opacity-25" href={`/product/${product.id}`}><CiCircleInfo/> Check</Link>
                                <button onClick={() => {approveProduct(product.id)}} className={`bg-transparent  text-green-500 hover:text-white hover:bg-green-700 px-2 py-1 border-2 border-green-500 rounded-lg`}>Approve</button>
                                <DeleteDialog onDeleteSuccess={handleDeleteSuccess} className="w-full" isAdmin={true} isApproval={true} productName={product.name} productId={product.id} images={product.images}/>
                            </div>
                        </div>
                    )
                })}
                </div> 
                        
                }
                <div ref={loader}></div>
                <ScrollBar orientation="horizontal" />
        </ScrollArea>






        
    </div>
  )
}

