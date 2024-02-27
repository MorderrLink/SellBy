import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';


import { useSelector } from 'react-redux';
import { RootState } from '~/redux/store';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function CartSheet() {
  const cart = useSelector((state: RootState) => state.cart);
  const user = useSession().data?.user
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

  const CartSheetItem = dynamic(() => import('~/components/CartSheetItem'), { ssr: false });
  return (
    <div className='flex flex-col gap-2'>
        {cart && cart.map((cartItem) => {
        return <CartSheetItem {...cartItem} />
        })}
        <h1>Total is : ${(total[1] ?? 0)} | {Math.round((total[0] ?? 0))} items</h1>
        <Button>
          <Link href={`/account/${user?.name}/checkout`}>
            Checkout
          </Link>
      </Button>
    </div>
  )
}