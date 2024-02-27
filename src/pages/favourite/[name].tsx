
import React, { useEffect, useState } from 'react'
import InfiniteScroll from '~/components/InfiniteScroll'

import { FaHeart } from "react-icons/fa";
import { api } from '~/utils/api';
import CardsSkeleton from '~/components/CardsSkeleton';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';


export default function favourite() {

  const session = useSession()
  const router = useRouter()

  const name = typeof router.query.name == "string" ? router.query.name : "undefined"
  
  useEffect(() => {
      if (session && session.status === "unauthenticated") {
          void router.push('/login')
      }
      if (session && name != session.data?.user.name) {
          void router.push(`/favourite/${session.data?.user.name}`)
      }


  }, [session.status])

  const [loaded, setLoaded] = useState<boolean>(false)
  const popularProducts = api.product.getPopular.useQuery().data
  useEffect(() => {
    if (popularProducts) {
       setLoaded(true)
    }
   }, [popularProducts])

  const Card = React.lazy(() => import('~/components/Card')) 

  return (
    <div className="body-background rounded-lg px-4 lg:mx-5 p-10  h-full w-full flex flex-col items-start justify-start bg-container-bg-color gap-10">
      <div className="w-full flex flex-row justify-center items-center p-2 gap-2">
        <FaHeart className='w-8 h-8'/>
        <h1 className='text-2xl font-medium '>Your favourite products</h1>
      </div>

        <InfiniteScroll favourite={true}/>

        <hr className='w-full h-1 border-none bg-tab-bg-color'/>
        <div className='w-full flex justify-center wtext-lg'>
          <h1 className='font-medium'>Most popular products!</h1>
        </div>
        <div id="recommended" className=" w-full rounded-2xl h-full px-2 py-3 flex flex-row flex-wrap justify-center gap-10 lg:pb-10 pb-20">
          { loaded ? (
              popularProducts?.map((product) => {
                return (
                  <React.Suspense fallback={<CardsSkeleton/>}>
                    <Card {...product}/>
                  </React.Suspense>
                )
              })
          ) : (
              <div className="flex flex-row flex-wrap gap-10 justify-center">
                <CardsSkeleton/><CardsSkeleton/><CardsSkeleton/><CardsSkeleton/><CardsSkeleton/><CardsSkeleton/><CardsSkeleton/><CardsSkeleton/><CardsSkeleton/><CardsSkeleton/>
              </div>
          )
          }
        </div>
    </div>
  )
}
