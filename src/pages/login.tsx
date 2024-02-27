import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { Button } from '~/components/ui/button'

export default function Login() {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session && session.status === "authenticated") {
        router.push(`/account/${session.data?.user.name}`)
    }

}, [session.status, session.data])

  return (
    <div className='body-background h-full rounded-lg w-full flex flex-col items-center justify-start gap-5 p-5 bg-container-bg-color'>
        <div className='flex flex-col gap-4'>
          <h1 className='pt-20 font-medium text-2xl'>Login to use all website features</h1>
          <Button
              onClick={() => { 
                  void signIn()
              }}
              variant={"outline"}
              size={'lg'} 
              className='w-full bg-secondary-bg-color border-0'>
                Login
          </Button>
        </div>
    </div>
  )
}
