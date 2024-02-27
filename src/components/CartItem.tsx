import { useDispatch } from 'react-redux';
import {
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
   } from '~/redux/slices/cartSlice';
import { Button } from './ui/button';

type CartItemProps = {
  id: string;
  price: number;
  images: { id: string; url: string; productId: string; }[];
  name: string;
  categories: string[];
  quantity: number;
}

export default function CartItem(props: CartItemProps) {
    const dispatch = useDispatch();
    return (
        <div className='w-full lg:w-5/12 flex flex-row gap-1 lg:gap-5 items-center py-2 px-5 rounded-lg bg-card-bg-color flex-nowrap'>
            <img className='w-16 h-16 rounded-lg' src={props.images[0]?.url ?? ""} alt="" />
            <div className='w-1/2 flex-nowrap overflow-hidden'>
                <h1>{props.name}</h1>
                
            </div>
            <div className='flex flex-col lg:flex-row gap-2 items-center'>
                <Button variant={"ghost"} onClick={() => { dispatch(incrementQuantity(props.id)) }}>+</Button>
                {props.quantity}
                <Button variant={"ghost"} onClick={() => { dispatch(decrementQuantity(props.id)) }}>-</Button>
            </div>
            <div className='w-1/12 flex justify-center'>
                <p>${props.price}</p>
            </div>

            <div>
                <Button variant={'destructive'} onClick={() => { dispatch(removeFromCart(props.id)) }}>Delete</Button>
            </div>
        </div>
    )
}
