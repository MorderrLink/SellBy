import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ProductCard from "~/components/OwnerProductCard";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import NewProductDialog from "~/components/NewProductDialog";
import CardsSkeleton from "~/components/CardsSkeleton";



export default function products() {

  const session = useSession()
  const router = useRouter()

  const name = typeof router.query.name == "string" ? router.query.name : "undefined"
  

  useEffect(() => {
      if (session && session.status === "unauthenticated") {
          void router.push('/login')
      }
      if (session && name != session.data?.user.name) {
          void router.push(`/account/${session.data?.user.name}/products`)
      }
  }, [session.status])
  
  
  
  const user = session.data?.user
  const userProducts = api.product.getProductsByUserId.useQuery({userId: user?.id ?? ""}).data

  const [loaded, setLoaded] = useState<boolean>(false)
  useEffect(() => {
    if (userProducts) {
       setLoaded(true)
    }
   }, [userProducts])


  


  return (
    <div className='body-background h-full rounded-lg w-full flex flex-col items-center justify-start gap-5 p-5 mb-20 lg:mb-0 bg-container-bg-color overflow-y-auto'>
      <div className="flex flex-col items-start ">
        <h1 className="font-medium text-xl text-zinc-900">Your products</h1>
        <p className="font-medium text-base text-balance text-neutral-700">Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur ex, nostrum dicta accusamus veniam, voluptate dolorum quos officiis minima magni maxime architecto laborum aliquam ducimus nemo debitis ratione porro vitae.
        Dolore eligendi voluptas officia quia, voluptate aut ea. Nesciunt cum sed a perspiciatis voluptate voluptas fugiat accusantium ea quis optio molestias error alias cumque ad commodi quidem, nihil debitis ipsam!</p>
      </div>
      <div className="px-4 py-2 bg-[#e0e0ee] bg-opacity-55 shadow-xl rounded-xl">
        {(userProducts && userProducts?.length > 9) 
        ? <div>
          You reached maximum of products! You are selling 10 products by now!
        </div> 
        : <div>
          <NewProductDialog/>
        </div>}
        
      </div>
      <div className="w-full flex flex-row flex-wrap items-center justify-start gap-10">

      { loaded ? (
              userProducts?.map((product) => {
                return (
                  <React.Suspense fallback={<CardsSkeleton/>}>
                    <ProductCard key={product.id} {...product}/>
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
