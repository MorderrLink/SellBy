import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

export default function orderId() {
    const [isHidden, setisHidden] = useState<boolean>(true)
    const router = useRouter()
    const session = useSession()
    const userName = session.data?.user.name
    useEffect( () => {

        setTimeout(() => {
            setisHidden(false)
        }, 2000)
        setTimeout(() => {
            if (!userName) {
                void router.push('/')
            } else {
                void router.push(`/account/${userName}/orders`)
            }
            
        }, 3000)
    }, [] )
  return (
    <div className='body-background inset-0 w-full h-full flex flex-col items-center justify-center'>
        <svg className="pl" width="240" height="240" viewBox="0 0 240 240">
	<circle className="pl__ring pl__ring--a" cx="120" cy="120" r="105" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 660" stroke-dashoffset="-330" stroke-linecap="round"></circle>
	<circle className="pl__ring pl__ring--b" cx="120" cy="120" r="35" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 220" stroke-dashoffset="-110" stroke-linecap="round"></circle>
	<circle className="pl__ring pl__ring--c" cx="85" cy="120" r="70" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round"></circle>
	<circle className="pl__ring pl__ring--d" cx="155" cy="120" r="70" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round"></circle>
    </svg>
    <h1 className={`${isHidden ? "hidden" : "block"} text-xl font-mono font-medium text-green-600`}>Success</h1>
    </div>
  )
}
