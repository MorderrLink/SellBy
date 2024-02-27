
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';


import { useSelector } from 'react-redux';
import { RootState } from '~/redux/store';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function cart() {

  const session = useSession()
  const router = useRouter()

  const name = typeof router.query.name == "string" ? router.query.name : "undefined"
  

  useEffect(() => {
      if (session && session.status === "unauthenticated") {
          router.push('/login')
      }
      if (session && name != session.data?.user.name) {
          router.push(`/account/${session.data?.user.name}/cart`)
      }
  }, [session.status])

  const cart = useSelector((state: RootState) => state.cart);
  const [total, setTotal] = useState<number[]>([0, 0])

  useEffect(() => {
    let totalQuantity = 0;
    let totalPrice = 0;

    for (let i = 0; i < cart.length; i++) {
        totalQuantity += cart[i]?.quantity ?? 0;
        totalPrice += ((cart[i]?.price ?? 0) * (cart[i]?.quantity ?? 0));
    }
    setTotal([totalQuantity, totalPrice]);
  }, [cart])


  const CartItem = dynamic(() => import('~/components/CartItem'), { ssr: false });
  
  return (
    <div className='body-background h-full rounded-lg w-full flex flex-col items-center justify-start gap-5 p-5 mb-20 lg:mb-0 bg-container-bg-color overflow-y-auto'>
      <h1 className='font-medium text-lg '>Your cart</h1>
      {cart && cart.map((cartItem) => {
        return <CartItem {...cartItem} />
      })}
      <h1>Total is : ${(total[1] ?? 0)} | {Math.round((total[0] ?? 0))} items</h1>
      <Button disabled={cart.length == 0}>
        <Link href={`/account/${session.data?.user.name}/checkout`}>
          Checkout
        </Link>
      </Button>
    </div>
  )
}
