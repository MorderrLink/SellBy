import { useSession } from "next-auth/react"
import Link from "next/link";
import { api } from "~/utils/api"
import  QRCode  from 'qrcode.react';

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

export default function orders() {
  const session = useSession()

  const orders = api.order.getOrdersByUserId.useQuery({
    userId: session.data?.user.id ?? ""
  }).data
  const listFormatter = new Intl.ListFormat('en', { style: 'long' });

  return (
    <div className="body-background h-full rounded-lg w-full flex flex-col items-center justify-start gap-5 p-5 mb-20 lg:mb-0 bg-container-bg-color overflow-y-auto">
      
      <ul className="flex flex-col gap-2">
        {orders?.map( (order, index) => {
          const dateFromNow = timeAgo(order.updatedAt)
          return (

          <div className=" bg-main-bg-color shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text-main-color mb-2">Order #{index+1}</h2>
            <p className="text-nav-text-color mb-4">Created:<span className="font-medium"> {dateFromNow}</span></p>
            <p className="text-nav-text-color mb-4">Total Price: <span className="font-medium">${order.totalPrice}</span></p>
            <div className="w-full flex justify-center p-4">
              <QRCode size={300} value={order.id} />
            </div>

            <ul className="space-y-2">
              <li className="bg-nav-bg-color p-4 rounded-lg">
                <div className="flex flex-row gap-2 items-center">
                  <img className="w-8 h-8 rounded-sm" src={order.products[0]?.product.images[0]?.url} alt="" />
                  <h3 className="text-lg font-semibold mb-2 text-text-main-color">{order.products[0]?.product.name}<span className="text-text-secondary-color">&times; {order.products[0]?.quantity}</span>{order.products.length > 1 && " , ..."}</h3>
                </div>
                <p className="mb-2">Price: <span className="font-medium">${order.products[0]?.product.price}</span></p>
                <p className="mb-2">Categories: <span className="font-medium">{listFormatter.format(order.products[0]?.product.categories ?? [])}</span></p>
                <div className="grid grid-cols-3 gap-2 mt-2">
                </div>
              </li>
            </ul>
            <Link className="w-full flex justify-center pt-2 " href={`/account/${session.data?.user.name}/orders/${order.id}`}> <span className="rounded-md px-2 py-1 border-2 hover:border-text-main-color border-transparent duration-200 ">More info</span> </Link>
          </div>

          )
        } )}
      </ul>

    </div>
  )
}
