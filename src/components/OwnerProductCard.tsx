import {
Card,
CardContent,
CardFooter,
CardHeader,
CardTitle,
} from "~/components/ui/card"
import { Button } from "./ui/button"
import { useState } from "react"
import Link from "next/link"
import { wrap } from "popmotion"
import { AnimatePresence, motion } from "framer-motion"


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
   
    const [[page, direction], setPage] = useState([0, 0]);
    const [imageIndex, setImageIndex] = useState(wrap(0, props.images.length, page))
    
    const paginate = (newDirection: number) => {
        setPage([page + newDirection, newDirection]);
        setImageIndex(wrap(0, props.images.length, page + newDirection))
      };

    


  return (
    <Card className="box-border overflow-hidden h-[450px] sm:w-full md:w-[250px] md:h-[400px] lg:w-[300px] lg:h-[450px] xl:w-[350px] xl:h-[500px] space-y-0 bg-card-bg-color border-card-bg-color shadow-lg shadow-card-bg-color">
        <CardHeader>
            <CardTitle className="flex flex-col items-start justify-center gap-2">
                {props.name} 
                <div className="flex flex-row gap-2 w-full justify-start px-2">
                    {props.categories.map(category => {
                        return <h1 className="font-medium bg-tab-bg-color rounded-md bg-opacity-60 text-nav-text-color px-2 py-1 ">{category}</h1>
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

        <div className="flex flex-row gap-2 py-2 w-full justify-start px-5">
            {props.isApproved ? <span className="text-sm text-green-500 bg-green-100 px-2 py-1 rounded-lg">For Sale</span> : <span className="text-sm text-yellow-600 bg-yellow-200 text-nowrap px-2 py-1 rounded-lg">Waiting for approval</span>}
        </div>
        
        <CardFooter>
            <Link href={`/product/${props.id}`}>
                <Button variant={"outline"} className="bg-transparent font-medium text-text-main-color hover:bg-[#e0e0ee] hover:bg-opacity-45">Manage</Button>
            </Link>
        </CardFooter>
    </Card>
  )
}
