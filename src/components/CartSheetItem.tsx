
import { useDispatch } from 'react-redux';
import {
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
   } from '~/redux/slices/cartSlice';
import { Button } from './ui/button';
import { ImBin } from "react-icons/im";

type CartItemProps = {
  id: string;
  price: number;
  images: { id: string; url: string; productId: string; }[];
  name: string;
  categories: string[];
  quantity: number;
}

export default function CartSheetItem(props: CartItemProps) {
    const dispatch = useDispatch();
    return (
        <div className='w-full flex flex-row gap-2 items-center justify-evenly py-2 px-5 rounded-lg bg-card-bg-color flex-nowrap'>
            <img className='w-14 aspect-square rounded-lg' src={props.images[0]?.url ?? ""} alt="" />
            <div className='max-w-1/2 flex-nowrap overflow-hidden'>
                <h1>{props.name.length > 10 ? props.name.slice(0, 20)+"..." : props.name}</h1>
                
            </div>
            <div className='flex flex-col gap-2 items-center'>
                <Button variant={"ghost"} onClick={() => { dispatch(incrementQuantity(props.id)) }}>+</Button>
                {props.quantity}
                <Button variant={"ghost"} onClick={() => { dispatch(decrementQuantity(props.id)) }}>-</Button>
            </div>
            <div className='flex lg:flex-row gap-2 flex-col items-center justify-evenly'>
                <div className='w-1/2 flex justify-center'>
                    <p>${props.price}</p>
                </div>

                <div>
                    <Button variant={'destructive'} className='w-min h-min p-2 flex items-center justify-center' onClick={() => { dispatch(removeFromCart(props.id)) }}><ImBin className='w-5 h-5'/></Button>
                </div>
            </div>
        </div>
    )
}
