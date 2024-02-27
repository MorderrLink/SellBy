"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import React, { useEffect, useRef, useState } from "react"
import { api } from "~/utils/api"
import { Skeleton } from "~/components/ui/skeleton"
import { MdModeEditOutline } from "react-icons/md";
import { Button } from "~/components/ui/button"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer"
import { Input } from "~/components/ui/input"

import { SingleImageDropzone } from '~/components/SingleImage';
import { useEdgeStore } from '~/lib/edgestore';
import { toast } from "sonner"
import { useTheme } from "next-themes"



export default function Settings() {
  const session = useSession()
  const router = useRouter()
  const name = typeof router.query.name == "string" ? router.query.name : "undefined"
  const utils = api.useContext()
  const { edgestore } = useEdgeStore();
  
  const {theme, setTheme} = useTheme();

  const [sessionLoaded, setSessionLoaded] = useState<boolean>(false)
  const [opened, setOpened] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File>();
  
  
  const userData = api.user.getUserByName.useQuery({name: name}).data 
  const DataMutation = api.user.changeUserProfile.useMutation({
    onSuccess() {
      void utils.user.getUserByName.invalidate()
    }
  })

  
  
  const NameChangeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {

    if (session.status == "unauthenticated") {
      void router.push('/login')
    }

    if (session.data?.user) {
      setSessionLoaded(true)
    }
    if(sessionLoaded && session.data?.user.name !== name) {
      void router.push(`/settings/${session.data?.user.name}`)
    }

  }, [session, session.data, session.data?.user])


  const getUnique = api.user.getUserByName.useQuery({name: NameChangeRef.current?.value ?? ""}).data;

  const validateNewName = () => {
    if (NameChangeRef.current?.value === undefined && file == undefined) return "You can't leave all fields blank!";
    if (NameChangeRef.current?.value.length === 0 && file == undefined) return "You can't leave all fields blank!";
    if ((NameChangeRef.current?.value !== undefined && NameChangeRef.current?.value.length < 4) && file == undefined) return 'This username is too short. Think of longer one! (min length: 4)';
    if ((NameChangeRef.current?.value !== undefined && NameChangeRef.current?.value.length > 25) && file == undefined) return 'This username is too long. Think of another one! (max length: 25)';
    if (getUnique != null && file == undefined) return 'User with this username already exists!';
    return true;
   };




  async function changeUserData(e: React.FormEvent) {
    e.preventDefault()
    const nameChange = NameChangeRef.current?.value == "" ? "" : NameChangeRef.current?.value
 
    const ImageChange = (file == null ?? file == undefined) ? "" : file  
    const validResult = validateNewName()
    if (validResult !== true) {
      setError(validResult)
      return
    }

    if(ImageChange !== "" && file != undefined) {
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          console.log(progress)
        },
      })
      DataMutation.mutate({
        image: res.url,
        name: name,
        newName: nameChange ?? ""
      })

    } else {
      DataMutation.mutate({
        image: "",
        newName: nameChange ?? "",
        name: name,
      })
    }
    setTimeout(() => {
      setOpened(false)
      setFile(undefined)
      toast.success("data updated")
    }, 1000)
    // console.log(nameChange, ImageChange)
    
  }


  return (
    <div className="body-background rounded-lg mx-5 p-4 lg:p-10  h-full w-full flex flex-col items-start justify-start bg-container-bg-color">
        <div className="w-full flex flex-col lg:flex-row gap-10 lg:gap-20 items-center justify-center">
          <div className="min-w-60 min-h-60">
            {userData ? <img src={userData?.image ?? ""} loading="lazy" className="rounded-full w-60 h-60" alt="" />
            : <Skeleton className="w-60 h-60 rounded-full" />}
          </div>

          <div className="w-full flex flex- items-center justify-center lg:items-start">
              <div className="w-full flex flex-row items-center justify-center lg:justify-start lg:items-start">
                
                  {userData ? <div className="flex flex-col "><h1 className="font-medium text-xl">{userData?.name}</h1>
                  <p className="font-medium text-sm text-zinc-600">{userData?.email}</p></div>
                  : <div className="flex flex-col gap-2"><Skeleton className="w-[250px] h-[20px]"/>
                    <Skeleton className="w-[200px] h-[15px]"/></div>
                  }
                
                <Drawer open={opened} onClose={() => setOpened(false)}>
                  <DrawerTrigger onClick={() => {
                    setOpened(true)
                  }} className="h-auto p-3 hover:scale-110">
                    <MdModeEditOutline />
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Change your profile</DrawerTitle>
                      <DrawerDescription className="text-[#504da8] font-bold text-sm">Leave any field blank to leave it without any change</DrawerDescription>
                      <form onSubmit={changeUserData} className="w-full flex flex-col justify-center items-center gap-7">
                        <div className="w-full flex flex-col gap-2 items-center">
                          <SingleImageDropzone
                            width={200}
                            height={200}
                            value={file}
                            onChange={(file) => {
                              setFile(file);
                            }}
                            className="lg:w-full"
                          />

                          <Input ref={NameChangeRef} className="" placeholder="Enter new username"/>

                          {error && <div className="w-full bg-zinc-500 bg-opacity-15 px-3 py-1 rounded-lg">
                            <h1 className="font-medium text-zinc-800">{error}</h1>
                          </div>}

                        </div>
                        <div id="DrawerFooter" className="w-full flex flex-col gap-2">
                          <Button className="w-full" type="submit">Submit</Button>
                          <DrawerClose className="w-full">
                            <Button onClick={() => {setOpened(false)}} variant="outline" className="w-full">Cancel</Button>
                          </DrawerClose>
                        </div>
                      </form>
                      
                    </DrawerHeader>

                  </DrawerContent>
                </Drawer>
              </div>
          </div>
          

        </div>
        
        <div className="w-full p-4 flex items-center gap-1 lg:justify-start justify-center">
          <h1 className="text-lg font-medium text-text-main-color">Choose a color for your interface -</h1>
          <Button onClick={() => setTheme("light")} className="bg-transparent hover:bg-nav-bg-color"> <span className="bg-purple-300 w-5 h-5 rounded-full"></span> </Button>
          <Button onClick={() => setTheme("dark")} className="bg-transparent hover:bg-nav-bg-color"> <span className="bg-neutral-500 w-5 h-5 rounded-full"></span> </Button>
          <Button onClick={() => setTheme("yellow")} className="bg-transparent hover:bg-nav-bg-color"> <span className="bg-yellow-300 w-5 h-5 rounded-full"></span> </Button>
          <Button onClick={() => setTheme("orange")} className="bg-transparent hover:bg-nav-bg-color"> <span className="bg-red-300 w-5 h-5 rounded-full"></span> </Button>
          <Button onClick={() => setTheme("blue")} className="bg-transparent hover:bg-nav-bg-color"> <span className="bg-blue-300 w-5 h-5 rounded-full"></span> </Button>
          <Button onClick={() => setTheme("green")} className="bg-transparent hover:bg-nav-bg-color"> <span className="bg-green-300 w-5 h-5 rounded-full"></span> </Button>
        </div>
    </div>
  )
}
