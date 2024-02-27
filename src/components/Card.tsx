import {
    Carousel,
    CarouselContent,
    CarouselItem,
  } from "~/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { type CarouselApi } from "~/components/ui/carousel"
import {
Card,
CardContent,
CardFooter,
CardHeader,
CardTitle,
} from "~/components/ui/card"
import { Button } from "./ui/button"
import { Suspense, useEffect, useRef, useState } from "react"
import Link from "next/link"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "~/components/ui/sheet"
import CartSheet from "./CartSheet"
import { useDispatch } from "react-redux"
import { addToCart } from "~/redux/slices/cartSlice"
import { toast } from "sonner"
import CardsSkeleton from "./CardsSkeleton"
import { MdAddShoppingCart } from "react-icons/md";
import { FaMagnifyingGlassArrowRight } from "react-icons/fa6";


import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";

type customImageProps = {
    id: string;
    url: string;
    productId: string;
}

type ProductCardProps = {
    id: string;
    name: string;
    description: string | null;
    price: number;
    images: customImageProps[];
    popularity: number;
    isApproved: boolean;
    categories: string[];
}

interface ReduxProduct {
    id: string;
    price: number;
    images: { id: string; url: string; productId: string; }[];
    name: string;
    categories: string[];
    quantity: number;
}




const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      };
    }
};
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};





export default function ProductCard(props: ProductCardProps) {
    const dispatch = useDispatch()

    const [[page, direction], setPage] = useState([0, 0]);
    const [imageIndex, setImageIndex] = useState(wrap(0, props.images.length, page))
    
    const paginate = (newDirection: number) => {
        setPage([page + newDirection, newDirection]);
        setImageIndex(wrap(0, props.images.length, page + newDirection))
      };



  function AddToCart() {
    
    if (props) {
      const product: ReduxProduct = {
        id: props.id,
        price: props.price,
        images: props.images,
        categories: props.categories,
        name: props.name,
        quantity: 1,
      }
      dispatch(addToCart(product))
      toast.success("Added to cart")
    }

  }

  const formatter = new Intl.NumberFormat('en-GB');


  return (
    <Suspense fallback={<CardsSkeleton/>}>
        <motion.div
            initial={{ opacity:  0.55, scale:  0.75 }}
            whileInView={{ opacity:  1, scale:  1 }}
            viewport={{ once: true }}
            transition={{ duration:  0.3 }}
        >

        
        <Card className="box-border overflow-hidden flex flex-col gap-0 justify-center  h-[500px] w-full md:w-[250px] md:h-[400px] lg:w-[300px] lg:h-[450px] xl:w-[350px] xl:h-[500px] space-y-0 bg-card-bg-color border-card-bg-color shadow-lg shadow-card-bg-color">
        <CardHeader>
            <CardTitle className="flex flex-col items-start justify-center gap-2">
                {props.name} 
                <div className="flex flex-row gap-2 w-full justify-start px-2">
                    {props.categories.map(category => {
                        return <h1 key={category} className="font-medium bg-[#e0e0ee] rounded-md bg-opacity-60 text-zinc-700 px-2 py-1">{category}</h1>
                    })}
                </div>
                

            </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-row items-center justify-center space-x-4 w-[300px] lg:w-auto">
        
            <AnimatePresence initial={false} custom={direction}>
                <motion.img
                key={page}
                src={props.images[imageIndex]?.url ?? ""}
                className="aspect-square w-[260px] h-[260px] flex justify-center items-center rounded-lg"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"

                transition={{
                    x: { type: "spring", stiffness: 300, damping: 52 },
                    opacity: { duration: 0.2 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);

                    if (props.images.length > 1) {
                        if (swipe < -swipeConfidenceThreshold) {
                                paginate(1);
                            } else if (swipe > swipeConfidenceThreshold) {
                                paginate(-1);
                            }
                    }
                }}
                />
            </AnimatePresence>
            
        </CardContent>
        {props.images.length > 1 && <div className="w-full flex flex-row gap-2 justify-center">
        {Array.from({ length:  props.images.length }).map((_, index) => (
        <div
          key={index}
          className={`block w-2 h-2 aspect-square rounded-full  ${imageIndex === index ? 'bg-text-main-color' : 'bg-text-secondary-color'}`}
          onClick={() => {
            setImageIndex(wrap(0, props.images.length, index))
            setPage([index, 1])
          }}
        >
        </div>
        ))}
        </div>}
        
        
        
        <CardFooter className="flex lg:gap-2 gap-1 py-2">
            <div className="flex flex-row lg:gap-2 py-2 justify-start px-2 lg:px-5">
                <span className="text-xl font-medium text-text-main-color ">${formatter.format(props.price)}</span>
            </div>
            <Link href={`/product/${props.id}`}>
                <Button variant={"ghost"} className="flex flex-row items-center gap-1 bg-primary-color text-text-secondary-color hover:bg-[#e0e0ee] hover:bg-opacity-45 shadow-lg">Details<FaMagnifyingGlassArrowRight/></Button>
            </Link>
            <Sheet>
            <SheetTrigger className="flex flex-row items-center gap-1 bg-primary-color text-text-secondary-color hover:bg-[#e0e0ee] hover:bg-opacity-45 px-3 py-1.5 rounded-md shadow-xl" onClick={() => { AddToCart() }}>Add<MdAddShoppingCart/></SheetTrigger>
            <SheetContent>
                <SheetHeader>
                <SheetTitle>Cart</SheetTitle>
                <CartSheet/>
                </SheetHeader>
            </SheetContent>
            </Sheet>
        </CardFooter>
    </Card>
    </motion.div>
    </Suspense>
  )
}
