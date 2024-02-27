"use client"
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import { api } from '~/utils/api'

import { IoIosArrowForward } from "react-icons/io";
import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { useEffect } from 'react';
import { Skeleton } from '~/components/ui/skeleton';

export default function Account() {
    const session = useSession()
    const router = useRouter()

    const name = typeof router.query.name == "string" ? router.query.name : "undefined"
    
    const userData = api.user.getUserByName.useQuery({name: name}).data

    useEffect(() => {
        if (session && session.status === "unauthenticated") {
            router.push('/login')
        }
        if (session && name != session.data?.user.name) {
            router.push(`/account/${session.data?.user.name}`)
        }


    }, [session.status])

  return (
    <div className='body-background h-full rounded-lg w-full flex flex-col items-center justify-start gap-5 p-5 bg-container-bg-color'>
        <div className='h-min w-30 flex flex-col items-center'>
            {userData ? <img src={userData?.image ?? ""} className='rounded-full w-52 h-52' alt="" /> : <Skeleton className="w-60 h-60 rounded-full" />}
            <h1 className='font-medium text-lg text-text-main-color'>{userData?.name}</h1>
        </div>

        <div className='w-full flex flex-col items-center gap-4'>
            <Link href={`/favourite/${name}`} className='w-full md:w-1/2 lg:w-5/12 flex flex-row items-center justify-between px-4 py-2 rounded-xl bg-card-bg-color shadow-xl'>
                <div className='flex flex-col gap-1'>
                    <h1 className='font-semibold text-xl text-text-main-color'>Favourite</h1>
                    <p className='text-text-secondary-color'>You can see the product you added to favourite Here</p>
                </div>
                <Button className='hover:scale-110 duration-200' variant={'ghost'}>
                    <IoIosArrowForward />
                </Button>
            </Link>
            
            <Link href={`/account/${name}/orders`} className='w-full md:w-1/2 lg:w-5/12 flex flex-row items-center justify-between px-4 py-2 rounded-xl bg-card-bg-color shadow-xl'>
                <div className='flex flex-col gap-1'>
                    <h1 className='font-semibold text-xl text-text-main-color'>Orders</h1>
                    <p className='text-text-secondary-color'>You can see your orders Here</p>
                </div>
                <Button className='hover:scale-110 duration-200' variant={'ghost'}>
                    <IoIosArrowForward />
                </Button>

            </Link>

            
            <Link className='w-full md:w-1/2 lg:w-5/12 flex flex-row items-center justify-between px-4 py-2 rounded-xl bg-card-bg-color shadow-xl' href={`/account/${name}/products`}>
                <div className='flex flex-col gap-1'>
                    <h1 className='font-semibold text-xl text-text-main-color'>Your Products</h1>
                    <p className='text-text-secondary-color'>You can sell products on this marketplace!</p>
                </div>
                <Button className='hover:scale-110 duration-200' variant={'ghost'}>
                    <IoIosArrowForward />
                </Button>
            </Link>

            <Button
             onClick={() => { 
                void signOut()
                
            }}
             variant={"outline"}
             size={'lg'} 
             className='bg-card-bg-color border-0'>Log out</Button>
            
        </div>

    </div>
  )
}
