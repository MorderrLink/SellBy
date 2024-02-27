import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react";
import { api } from "~/utils/api"

function timeAgo(date: Date) {
  const now = new Date().getTime();
  const diffInMilliseconds = Math.abs(now - date.getTime());
  const diffInSeconds = Math.floor(diffInMilliseconds /  1000);
  const diffInMinutes = Math.floor(diffInSeconds /  60);
  const diffInHours = Math.floor(diffInMinutes /  60);
  const diffInDays = Math.floor(diffInHours /  24);

  if (diffInDays >  0) {
    return diffInDays ===  1 ? '1 day ago' : `${diffInDays} days ago`;
  } else if (diffInHours >  0) {
    return diffInHours ===  1 ? '1 hour ago' : `${diffInHours} hours ago`;
  } else if (diffInMinutes >  0) {
    return diffInMinutes ===  1 ? '1 min ago' : `${diffInMinutes} mins ago`;
  } else {
    return diffInSeconds <=  1 ? 'just now' : `${diffInSeconds} secs ago`;
  }
}



export default function UserOrderPage() {
 
  const session = useSession()
  const router = useRouter()
  const orderId = (typeof router.query.orderId == "string") ? router.query.orderId : ""  
  const order = api.order.getOrder.useQuery({
    orderId: orderId
  }).data
  
  useEffect(() => {
    if (order && session) {
      if (order.customer.name !== session.data?.user.name) {
        void router.push(`account/${order?.customer.name}/orders`)
      }
    }
  }, [order, session])
  
  return (
    <div className="body-background w-full h-full flex justify-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="bg-container-bg-color shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-text-main-color">
                    Order #{ order?.updatedAt.getTime()}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-text-secondary-color">
                    Updated {order && timeAgo(order?.updatedAt)}
                </p>
            </div>
            <div className="border-t border-nav-bg-color">
                <dl>
                    <div className="bg-container-bg-color px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-text-secondary-color">Total Price</dt>
                        <dd className="mt-1 text-sm text-text-main-color sm:mt-0 sm:col-span-2">${ order?.totalPrice }</dd>
                    </div>
                </dl>
            </div>
            <div className="border-t border-nav-bg-color">
                <dl>
                    <div className="px-4 py-5 sm:px-6">
                        <h4 className="text-base leading-6 font-medium text-text-main-color">Products</h4>
                    </div>
                    <div className="bg-container-bg-color px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <ul className="divide-y divide-nav-bg-color">
                          { order?.products.map(item => {
                            return (
                              <li className="py-4 flex flex-row">
                                  <img src={ item.product.images[0]?.url ? item.product.images[0]?.url : "/favicon.ico" } alt="" className="h-16 w-16 object-cover rounded"/>
                                  <div className="ml-4">
                                      <div className="text-sm font-medium text-text-main-color">{ item.product.name }</div>
                                      <div className="text-sm text-text-secondary-color">Quantity: { item.quantity }</div>
                                      <div className="text-sm text-text-secondary-color">Price per unit: ${ item.product.price }</div>
                                  </div>
                              </li>
                            )
                          }) }      
                      
                        </ul>
                    </div>
                </dl>
            </div>
        </div>
      </div>
    </div>
  )
}
