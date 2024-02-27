import Link from "next/link"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";


type NavbarLinkProps = {
    text: string;
    href: string;
    icon?: React.ReactNode;
    isOpened: boolean;
    disabled: boolean;
}

export default function NavbarLink({text, href, icon, isOpened, disabled}:NavbarLinkProps) {
  const router = useRouter()
  const cart = useSelector((state: RootState) => state.cart);
    const [total, setTotal] = useState<number>(0)
    useEffect(() => {
      setTotal(0)
      cart.map(x => {
        setTotal(prev => prev + x.quantity)
      })
      
        

    }, [cart, total])

  
  return (
    <button  disabled={disabled} className={`${disabled && "text-[#c4c3e3]"}`}>
        <Link onClick={(e) => { e.preventDefault(); router.push(href) }} href={href}  className={`px-2 py-2 flex flex-row items-center  gap-5 hover:bg-secondary-bg-color duration-200 lg:focus-visible:bg-transparent sm:focus-visible:bg-secondary-bg-color rounded-lg`}>
            <div className="w-8 h-8 p-0">{icon}</div>
            <h1 className={`hidden lg:block  font-semibold text-nav-text-color text-xl ${isOpened ? "opacity-100" : "opacity-0"} duration-300 `}> {text} {text=="Cart" && <span className="bg-tab-bg-color px-2 rounded-full">{total}</span>} </h1>
        </Link>
    </button>

    
  )
}
