import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import AdminApproval from "~/components/AdminApproval"
import AdminSearchProducts from "~/components/AdminSearchProducts"
import AdminSearchUsers from "~/components/AdminSearchUsers"


export default function dashboard() {
    const session = useSession()
    const router = useRouter()
    const [confirmed, setConfirmed] = useState(false)
    useEffect(() => {
        
        if (session && session.status == "unauthenticated") {
            void router.push('/')
        } else if (session && session.data?.user && !session.data?.user.admin) {
            console.log("YOU ARE NOT ADMIN!!!")
            void router.push('/')
        } else if (session && session.data?.user && session.data?.user.admin == true) {
            setConfirmed(true)
        }
    }, [session, session.status, session.data])


  return (
    <div className="body-background rounded-lg mx-5 p-4 lg:p-10  h-full w-full flex flex-col items-start justify-start bg-container-bg-color ">
        <div className={`${confirmed ? "opacity-100" : "opacity-0"} h-full w-full flex flex-col items-start justify-start gap-10`}>
            
            <div className="w-full flex flex-col justify-center items-center">
                <h1 className="text-text-main-color">Confirmed Admin!</h1>
                <h2 className="text-text-secondary-color">logged in as <span className="font-mono">{session.data?.user.name}</span></h2>
            </div>

            <div className="w-full flex justify-center">
                <AdminSearchUsers/>
            </div>
            <div className="w-full flex justify-center">
                <AdminSearchProducts/>
            </div>

            <div className="w-full flex flex-col justify-center">
                <h1 className="w-full flex justify-center py-4 font-medium text-2xl text-[#c4bdbd]">Products waiting for approval</h1>
                <AdminApproval/>
            </div>

        </div>
    </div>
  )
}
