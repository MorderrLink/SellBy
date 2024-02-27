import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { BsCart4 } from "react-icons/bs";
import { PiPackageThin } from "react-icons/pi";
import { FcSimCardChip } from "react-icons/fc";
import { FaCcMastercard } from "react-icons/fa";
import { motion, useAnimation } from 'framer-motion';
import { TypewriterEffectSmooth } from './ui/type-writer';


const words = [
    {
        text: "1111",
    },
    {
        text: "2222",
    },
    {
        text: "3333",
    },
    {
        text: "4444",
    },
]



export default function ContentChoosing() {
    const [page, setPage] = useState<number>(1)
    const controls1 = useAnimation();
    const controls2 = useAnimation();
    const controls3 = useAnimation();

    const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined);

    useEffect(() => {

        setWindowWidth(window.innerWidth)

    }, [])


    useEffect(() => {
        const handleResize = () => {
        setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);





    useEffect( () => {

        controls1.start({
            x: [0,  300,  0],
            y: [0, -10, 0],
            rotate: [0,  100,  0],
            transition: {
            duration:  5,
            ease: "easeInOut",
            times: [0,  0.5,  1],
            loop: Infinity,
            repeat: Infinity,
            repeatDelay:  0.25
            }
        });

    }, [controls1]);


    useEffect( () => {
        if (windowWidth && windowWidth > 500 ) {
            controls2.start({
                x: [0, 0,  150, 250],
                y: [0, 0, 0, 100],
                opacity: [0.3, 1, .4, 0],
                rotate: [0, 0,  300, 360],
                transition: {
                duration:  3,
                ease: "easeInOut",
                times: [0, 0.1, 0.5, 1],
                repeat: Infinity,
                repeatDelay: 1.5
                }
            });
        } else if(windowWidth && windowWidth <= 500)  {
            controls2.start({
                x: [0, 0,  80, 120],
                y: [0, 0, 0, 100],
                opacity: [0.3, 1, .4, 0],
                rotate: [0, 0,  300, 360],
                transition: {
                duration:  3,
                ease: "easeInOut",
                times: [0, 0.1, 0.5, 1],
                repeat: Infinity,
                repeatDelay: 1.5
                }
            });
        }

    }, [controls2, windowWidth]);

    useEffect( () => {

        controls3.start({
            y: [0, 100, -10, 5],
            transition: {
            duration:  2,
            ease: "easeInOut",
            times: [0, 0.3, 0.8,  1],
            repeat:Infinity,
            repeatDelay: 2,
            delay: 0,
            }
        });
    }, [controls3]);



  return (
    <div>

        <div className='w-full flex flex-row justify-between px-2 py-4'>
            <Button disabled={page==1 ? true : false} onClick={() => { setPage(prev => prev - 1) }}> <IoIosArrowRoundBack/> Back  </Button>
            <Button disabled={page==4 ? true : false} onClick={() => { setPage(prev => prev + 1) }}> Next <IoIosArrowRoundForward/> </Button>
        </div>

        <div className={`${page == 1 ? "block" : "hidden"}   `}>
            <h1 className='w-full flex justify-center'>Choosing</h1>
            {/* Передвигающаяся лупа(Z index 40) и квадратики opacity:0.45d */}
            <div className='w-full flex flex-col gap-5 py-10'>
                <p className='text-xl text-[#bebebe] text-center'>Choose a product you like from any of the categories. Read it's detailed charachteristics and description carefully. Make sure it's the right one.</p>
                <div className='w-full flex flex-row items-center justify-center gap-7 '>
                    <div className='w-[75px] h-[75px] aspect-square bg-main-bg-color border-[1px] border-text-main-color border-opacity-5 bg-blend-darken rounded-lg'>
                        <motion.div animate={controls1}><CiSearch className='w-[85px] h-[85px]'/></motion.div>
                    </div>
                    <div className='w-[75px] h-[75px] aspect-square bg-main-bg-color border-[1px] border-text-main-color border-opacity-5 bg-blend-darken rounded-lg'></div>
                    <div className='w-[75px] h-[75px] aspect-square bg-main-bg-color border-[1px] border-text-main-color border-opacity-5 bg-blend-darken rounded-lg'></div>
                    <div className='w-[75px] h-[75px] aspect-square bg-main-bg-color border-[1px] border-text-main-color border-opacity-5 bg-blend-darken rounded-lg'></div>
                </div>
            </div>
        </div>


        <div className={`${page == 2 ? "block" : "hidden"}   `}>
            
            <h1 className='w-full flex justify-center'>Adding to cart</h1>  
            <div className='w-full flex flex-col gap-5 py-10'>
                <p className='text-xl text-[#bebebe] text-center'>Add a product to your cart. Either continue shopping or go to the Checkout.</p>
                <div className='h-full flex flex-col items-center justify-center gap-7 py-5 px-10'>
                    <div className='h-[85px] w-full  flex flex-row justify-start aspect-square '>
                        <motion.div className='w-[85px] h-[85px]' animate={controls2} ><PiPackageThin className='w-[85px] h-[85px]'/></motion.div>
                    </div>
                    <div className='h-[85px] w-full flex flex-row justify-end aspect-square'>
                        <BsCart4 className='w-[85px] h-[85px] opacity-85'/>
                    </div>
                </div>
                
            </div>
            {/* productIcon & cartIcon (двигать productIcon ->) */}
        </div>


        <div className={`${page == 3 ? "block" : "hidden"}   `}>
            <h1 className='w-full flex justify-center'>Paying</h1>
            <div className='w-full flex flex-col gap-5 py-10 h-max'>
                <p className='text-xl text-[#bebebe] text-center'>Pay for the order online with your card.</p>
                <motion.div className='mt-[100px] bg-gradient-to-br from-indigo-600 to-yellow-300  w-full h-[180px] lg:h-[500px] rounded-lg'>
                <div className='w-full px-5 py-3 flex justify-between'>
                    <FcSimCardChip className='w-[50px] h-[50px]'/>
                    <FaCcMastercard className='w-[50px] h-[50px]'/>
                </div>
                
                <TypewriterEffectSmooth words={words} className='w-full flex justify-center px-4 text-sm' />
                </motion.div>
            </div>  
            {/* карта и succsess 1 раз */}
        </div>


        <div className={`${page == 4 ? "block" : "hidden"}   `}>
            <h1 className='w-full flex justify-center'>Order & QR</h1>   
            <div  className='w-full flex flex-col gap-5 py-10 h-max'>
                <motion.img animate={controls3} src="/QRCode.png" alt="QRCode" className='aspect-square' />
            </div>
        </div>
    </div>
  )
}
