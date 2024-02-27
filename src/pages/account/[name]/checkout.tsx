
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import type { RootState } from '~/redux/store';
import { useDispatch } from 'react-redux';
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { api } from '~/utils/api';
import { useRouter } from 'next/router';
import { clearCart } from '~/redux/slices/cartSlice';
import { validateCard } from '~/utils/validate';



export default function checkout() {
  const dispatch = useDispatch();
  const session = useSession()
  const router = useRouter()
  const cart = useSelector((state: RootState) => state.cart);
  
  const name = typeof router.query.name == "string" ? router.query.name : "undefined"
    
  useEffect(() => {
      if (session && session.status === "unauthenticated") {
          void router.push('/login')
      }
      if (session && name != session.data?.user.name) {
          void router.push(`/account/${session.data?.user.name}/checkout`)
      }
  }, [session.status])

  const [inputType, setInputType] = useState<"password" | "text">("password")
  const [inputIcon, setInputIcon] = useState(<AiOutlineEye className='w-6 h-6'/>)
  const [value, setValue] = useState('');
  const cardNumberRef = useRef<HTMLInputElement | null>(null)
  const cvcRef = useRef<HTMLInputElement | null>(null)
  const nameInputRef = useRef<HTMLInputElement | null>(null)
  const addressInputRef = useRef<HTMLInputElement | null>(null)

  const [error, setError] = useState<string>("")

  const [total, setTotal] = useState<number[]>([0, 0])
  const userId = session.data?.user.id
  const OrderCreation = api.order.createOrder.useMutation()
  const OrderItemMutation = api.order.addOrderItem.useMutation()


  useEffect(() => {
    let totalQuantity = 0;
    let totalPrice = 0;

    for (let i = 0; i < cart.length; i++) {
        totalQuantity += cart[i]?.quantity ?? 0;
        totalPrice += ((cart[i]?.price ?? 0) * (cart[i]?.quantity ?? 0));
    }

    setTotal([totalQuantity, totalPrice]);
  }, [cart])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let val = event.target.value;
      val = val.replace(/\//g, "");
      if (val.length > 2) {
        setValue(val.slice(0, 2) + '/' + val.slice(2));
      } else {
        setValue(val.slice(0, 2))
      }
  };


  function ChangeInput () {
    setInputType(prev => prev == "text" ? "password" : "text")
    setInputIcon(inputType == "text" ? <AiOutlineEye className='w-6 h-6'/> : <AiOutlineEyeInvisible className='w-6 h-6'/>)
  }

  async function CreateOrder () {
    if (userId == undefined) return 

    const validationResult = validateCard({ 
        number: cardNumberRef.current?.value ?? "", 
        date: value, cvc: cvcRef.current?.value ?? "", 
        address: addressInputRef.current?.value ?? "",
        holderName: nameInputRef.current?.value ?? ""
    })

    if (validationResult != "Valid") {
        setError(validationResult)
        return
    } else {
        
        const orderId = await OrderCreation.mutateAsync({
            userId: userId
        })
        cart.map(async (product) => {
            await OrderItemMutation.mutateAsync({
                orderId: orderId,
                productId: product.id,
                quantity: product.quantity,
                price: product.price
            })
        })
    
        setTimeout( () => {
            dispatch(clearCart())
        }, 2000)
        void router.push(`/success/${orderId}`)

    }

    
  }


  const CheckoutItem = dynamic(() => import('~/components/CheckoutItem'), {ssr: false});
  return (
    <div className='body-background h-full rounded-lg w-full flex flex-col items-center justify-start gap-5 p-5 mb-20 lg:mb-0 bg-container-bg-color overflow-y-auto'>
        <div className="w-full bg-container-bg-color min-h-screen flex flex-col lg:flex-row lg:gap-0 gap-5 flex-grow px-2 py-4">
        
        <div className="bg-container-bg-color-bg-color flex flex-col justify-center gap-2 items-center lg:w-1/2 w-full">
            {cart && cart.map(cartItem => {
              return <CheckoutItem key={cartItem.id} {...cartItem} />
            })}
        </div>
        
        
        <div className="bg-white dark:bg-gray-900 w-full lg:w-1/2 flex flex-col">
            <div className="max-w-lg w-full m-auto px-6 py-6 sm:py-10">
                <div className="mb-5">
                    <label htmlFor="input-number" className="block text-sm font-medium mb-2 dark:text-white">Card number</label>
                    <input ref={cardNumberRef} inputMode='numeric' type="text" id="input-number" maxLength={16} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 placeholder-gray-300 dark:placeholder-gray-500 shadow-sm" placeholder="0000 0000 0000 0000"/>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                    <div className="mb-5">
                        <label htmlFor="input-exp" className="block text-sm font-medium mb-2 dark:text-white">Expiration</label>
                        <input inputMode='numeric' type="text" id="input-exp" value={value} onChange={handleChange} maxLength={5} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 placeholder-gray-300 dark:placeholder-gray-500 shadow-sm" placeholder="MM/YY"/>
                    </div>
                    <div className="mb-5">
                        <label htmlFor="input-cvc" className="block text-sm font-medium mb-2 dark:text-white">CVC</label>
                        <input inputMode='numeric' ref={cvcRef} type={inputType} id="input-cvc" maxLength={3} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 placeholder-gray-300 dark:placeholder-gray-500 shadow-sm" placeholder="CVC"/>
                        <button className='w-full flex p-2 justify-end' onClick={ChangeInput}>{inputIcon}</button>
                    </div>
                </div>
                <div className="mb-5 text-xs text-gray-400 dark:text-gray-500">By providing your card information, you allow Company to charge your card for future payments in accordance with their terms.</div>
                <div className="mb-5">
                    <label htmlFor="input-name" className="block text-sm font-medium mb-2 dark:text-white">Cardholder name</label>
                    <input type="text" id="input-name" ref={nameInputRef} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 placeholder-gray-300 dark:placeholder-gray-500 shadow-sm" placeholder="John Doe"/>
                </div>
                <div className="mb-5">
                    <label htmlFor="input-address" className="block text-sm font-medium mb-2 dark:text-white">Billing address</label>
                    <input type="text" id="input-address" ref={addressInputRef} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 placeholder-gray-300 dark:placeholder-gray-500 shadow-sm" placeholder="123 Main St"/>
                </div>

                {error != "" && <div className="mb-5">
                    <h1>{error}</h1>
                </div>}

                <div className="mb-5">
                    <div className="flex justify-between py-1 text-gray-700 dark:text-gray-200 font-medium">
                        <div>Subtotal</div>
                        <div>${total[1]}</div>
                    </div>
                    <div className="flex justify-between py-1 text-gray-700 dark:text-gray-200 font-medium">
                        <div>Total</div>
                        <div>${total[1] && total[1]*1.05}</div>
                    </div>
                </div>
                <button onClick={() => { CreateOrder() }} type="button" className="w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all dark:focus:ring-offset-gray-800">
                    Pay ${total[1] && total[1]*1.05}
                </button>
            </div>
        </div>
      </div>
  </div>
  )
}
