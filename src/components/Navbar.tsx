import NavbarLink from "./NavbarLink"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
// Icons imports
import { FaBasketShopping } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { TiShoppingCart } from "react-icons/ti";


export default function Navbar() {
    const [isOpened, setIsOpened] = useState<boolean>(false)


        
  const session = useSession()
  const user = session.data?.user.name
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    if (session.data?.user === undefined) {
        setDisabled(true)
    } else {
        setDisabled(false)
    }
    
  }, [session, session.data, session.status])

  return (
    <div 
    onMouseEnter={() => { setIsOpened(true) }} 

    onMouseLeave={() => { setIsOpened(false) }} 
    className={`z-40 w-full sm:w-auto md:w-full fixed bottom-0 left-0 flex flex-row justify-evenly items-center  lg:flex-col lg:top-0 lg:right-full ${isOpened ? "lg:w-[180px] lg:border-r-4" : "lg:w-[80px] lg:pl-3"} duration-200 lg:justify-start lg:rounded-r-xl bg-nav-bg-color`}>
        <div className="flex flex-row w-full lg:h-screen sm:w-auto md:w-full lg:flex-col justify-evenly lg:justify-between py-2 lg:py-5 ">
            <div className="flex gap-2 lg:flex-col">
                <NavbarLink  href={'/'} disabled={disabled} text={"Shop"} isOpened={isOpened} icon={<FaBasketShopping className="w-8 h-8 text-nav-text-color"/>}/>
                <NavbarLink href={'/search'} disabled={disabled} text={"Search"} isOpened={isOpened} icon={<FaSearch className="w-8 h-8 text-nav-text-color"/>}/>
                <NavbarLink href={`/favourite/${user}`} disabled={disabled} text={"Favourite"} isOpened={isOpened} icon={<FaHeart className="w-8 h-8 text-nav-text-color"/>}/>
            </div>
            <div className="flex gap-2 lg:flex-col">
                <NavbarLink href={`/account/${user}/cart`} disabled={disabled} text={"Cart"} isOpened={isOpened} icon={<TiShoppingCart className="w-8 h-8 text-nav-text-color"/>}/>
                <NavbarLink href={`/account/${user}`} disabled={disabled} text={"Account"} isOpened={isOpened} icon={<FaUser className="w-8 h-8 text-nav-text-color"/>}/>
                <NavbarLink href={`/settings/${user}`} disabled={disabled} text={"Settings"} isOpened={isOpened} icon={<IoSettingsSharp className="w-8 h-8 text-nav-text-color"/>}/>
            </div>
        </div>
    </div>
  )
}
