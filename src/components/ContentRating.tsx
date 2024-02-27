import { useAnimatedCounter } from "~/hooks/useAnimatedCounter"
import { motion } from "framer-motion"
import { BsFillRocketFill } from "react-icons/bs"
export const DyncamicContent = () => {
    const countAnimation = useAnimatedCounter(1000, 100, 5)
    return (
    <div className="w-full overflow-hidden relative h-max lg:h-full rounded-2xl p-1 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-teal-700 to-indigo-700">
          <div className="w-full h-full overflow-hidden relative rounded-xl p-10 text-xl md:text-4xl font-bold text-white bg-card-bg-color ">
            <p className="text-shadow">Rating & recommendations</p>
            <div className="flex flex-row py-3 px-2 gap-2 items-center">
              <motion.h1
               className="h-full flex items-center"
               initial={{ opacity: 0.2, color: "rgb(0, 0, 0)" }}
               animate={{ color: "rgb(25, 243, 105)", opacity: 1 }}
               transition={{ duration: 5 }}>{countAnimation}</motion.h1>
              <BsFillRocketFill className="text-green-500 w-full h-full aspect-square"/>
            </div>
            <div className="">
            <article className="text-xl font-sans letter-spacing text-[#bebebe]">Our service provides great system of rating and recommendations, so that customers could find what they need and salesmen could show their products to the right audience</article>
            </div>
          </div>
        </div>
    )
  }