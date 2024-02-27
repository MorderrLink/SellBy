import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { api } from "~/utils/api"
import { Button } from "~/components/ui/button"
import { toast } from "sonner"

import { BsFillRocketFill } from "react-icons/bs";
import { TiShoppingCart } from "react-icons/ti";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import Link from "next/link"
import DeleteDialog from "~/components/DeleteDialog"

import { useDispatch } from 'react-redux';
import { addToCart } from '~/redux/slices/cartSlice';
import { FaArrowDownWideShort } from "react-icons/fa6";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import ImageModal from "~/components/ui/ImageModal"
import { motion } from "framer-motion"






interface ReduxProduct {
  id: string;
  price: number;
  images: { id: string; url: string; productId: string; }[];
  name: string;
  categories: string[];
  quantity: number;
 }
 



export default function Product() {
    const router = useRouter()
    const utils = api.useContext()
    const dispatch = useDispatch();
    const session = useSession()
    const productId = typeof router.query.productId == "string" ? router.query.productId : ""
    const isAuthenticated = !!session.data?.user
    const productData = api.product.getProductById.useQuery({
      productId: productId
    }).data
    const existingFavourite = api.product.findExistingFavourite.useQuery({
      name: session.data?.user.name ?? "",
      productId: productData?.id ?? ""
    }).data

    const [isOwner, setIsOwner] = useState(false)
    useEffect(() => {
      setIsOwner(productData?.ownerId == session.data?.user.id)
    }, [session, session.data?.user, productData]) 

    const FavouritedCount = api.product.CountFavourites.useQuery({
      productId: productData?.id ?? ""
    }).data

    const [favs, setFavs] = useState<number | 0>(FavouritedCount ?? 0)

    const FavouriteMutation = api.product.addToFavourite.useMutation({
      onSuccess() {
          utils.product.getProducts.invalidate()
          utils.product.getProductById.invalidate()
      }

  })

    const [isFavourited, setFavourited] = useState<boolean>(false)
    const [hoveredImage, setHoveredImage] = useState<{
      id: string;
      url: string;
      productId: string;
  } | null>(null)
    
  useEffect(() => {
    setHoveredImage(productData?.images[0] ?? null)
  }, [productData])
    
  useEffect(() => {
    setFavourited(existingFavourite ?? false)
  }, [existingFavourite])
    
  useEffect(() => {
    setFavs(FavouritedCount ?? 0)
  }, [FavouritedCount])

  async function addToFavourite() {

      const result = await FavouriteMutation.mutateAsync({
        name: session.data?.user.name ?? "",
        productId: productData?.id ?? ""
      })
      
    }

  async function AddToCart() {
    
    if (productData) {
      const product: ReduxProduct = {
        id: productData.id,
        price: productData.price,
        images: productData.images,
        categories: productData.categories,
        name: productData.name,
        quantity: 1,
      }
      dispatch(addToCart(product))
      toast.success("Added to cart")
    }

  }
  
  const [isSeen, setIsSeen] = useState(false)

  const setNewSeen = api.seen.newSeen.useMutation({
    onSuccess(res) {
      console.log("Res: seen", res.seen)
      utils.product.getProductById.invalidate()
    }
  })

  useEffect(() => {

    if (session.data && session.data.user) {
      if (!isSeen && session.data.user.id ) {
        setNewSeen.mutate({ productId: productId, userId: session.data.user.id })
        setIsSeen(true)
      }

    }

  }, [session])





    return (
    <div className='body-background h-full rounded-lg w-full flex flex-col items-center justify-start gap-5 p-5 mb-20 lg:mb-0 bg-container-bg-color overflow-y-auto'>
      <div className="w-full flex flex-col lg:flex-row items-center justify-around py-5 lg:gap-0 gap-10">
        <div className="w-full lg:w-7/12 flex flex-col-reverse lg:flex-row gap-5 lg:px-10">
          <div className="flex flex-row justify-center lg:flex-col lg:justify-start gap-3 lg:gap-1">
            {productData?.images.map(image => {
              return <div className="rounded-xl h-12 w-12 lg:w-20 lg:h-20">
                <img onClick={() => {setHoveredImage(image)}} onMouseEnter={() => {setHoveredImage(image)}} src={image.url} className="rounded-xl h-full w-full lg:w-20 lg:h-20" alt="" />
              </div>
            })}
          </div>
          <div  className="h-[200px] lg:h-[600px] flex items-center justify-center">
            <ImageModal imageSrc={hoveredImage?.url ?? ""}>
              <img className="h-full rounded-md aspect-square" src={hoveredImage?.url} alt="" />
            </ImageModal>
          </div>
          
        </div>
        <div className="w-full lg:w-1/3 h-full flex flex-col justify-start items-start gap-3 ">
          
          <h1 className="text-2xl font-bold  text-text-main-color">{productData?.name}</h1>
          
          <div>
            <h4 className="font-mono">Description:</h4>
            <p className="font-medium" >{productData?.description}</p>
          </div>
          
          <div>
            <h4 className="font-mono">Categories</h4>
            <div className="flex flex-row gap-2 py-2 w-full justify-start">
              {productData?.categories.map(category => {
                return <h1 className="font-medium bg-tab-bg-color rounded-md bg-opacity-60 text-text-secondary-color px-2 py-1 ">{category}</h1>
              })}
            </div>
          </div>
          
          <div className="flex flex-row items-center gap-2 text-lg font-medium">
            <BsFillRocketFill className="text-green-500"/>
            {productData?.popularity}
          </div>

          <div className="flex flex-row items-center gap-2">
              <Button disabled={!isAuthenticated} className="#504da8" onClick={() => { AddToCart() }}>Buy for ${productData?.price}</Button>
              <Button disabled={!isAuthenticated}>
                <Link className="flex flex-row items-center gap-1" href={`/account/${session.data?.user.name}/cart`}>
                  Go to <TiShoppingCart/>
                </Link>
              </Button>
              <Button
               onClick={() => {
                setFavourited(prev => !prev)
                addToFavourite()
               }}
               disabled={!isAuthenticated}>{
                isFavourited ? <FaHeart className="text-red-500"/> : <FaRegHeart/>
              }</Button>
              
              {!isAuthenticated && <div>
                  <Link className="text-indigo-800 font-medium text-lg" href={'/login'}>
                     - Login to use
                  </Link>
                </div>}
              
          </div>
              
          {isOwner && productData &&
            <div>
              <h1 className="text-lg font-mono">You are the owner of this product</h1>
              <p className="text-sm font-mono text-zinc-700">You are able to delete it from the market</p>
              <DeleteDialog productName={productData.name} productId={productId} images={productData.images}/>
            </div>
          }
        </div>
      </div>

      <Collapsible>
        <CollapsibleTrigger className="w-full flex items-center justify-center">
          <h1 className="text-xl font-medium space-x-2 flex flex-row items-center"><span>More details</span> <span><FaArrowDownWideShort/></span></h1>
        </CollapsibleTrigger>


        <CollapsibleContent>
        <div className="w-full py-5 flex flex-col justify-center lg:justify-start" id="charachteristics">
          <h1 className="w-full flex justify-center">Characteristics</h1>
          {productData?.characteristics.map((characteristic, index) => {
                    return <motion.div
                            className="container space-y-2"
                            initial={{ opacity: 0, scale: index*0.15 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2, delay: index*0.05 }}>
                            <span className="pull-left text-[#4e4e4e]">{characteristic.key}</span>
                            <span className="pull-right before:lg:w-[700px]">{characteristic.value}</span>
                          </motion.div>
          })}
        </div>
        </CollapsibleContent>
      
      </Collapsible>


      
      

    </div>
  )
}
