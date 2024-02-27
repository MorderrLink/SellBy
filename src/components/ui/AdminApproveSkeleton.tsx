import React from 'react'
import { Skeleton } from './skeleton'

export default function AdminApproveSkeleton() {
  return (
    <div className="h-[350px] w-[300px] flex flex-col  items-center gap-3 px-5 py-2 rounded-md border-[1px] border-nav-bg-color">
                                    <Skeleton className="w-[250px] h-[20px] rounded-lg"/>
                                    <Skeleton className="w-16 h-16 ronded-lg aspect-square" />
                                    <div className="flex flex-row gap-2">
                                        <Skeleton className="w-[75px] h-[20px]"/>
                                        <Skeleton className="w-[75px] h-[20px]"/>
                                    </div>
                                    <Skeleton/>
                                    <div className="flex flex-row gap-4 items-center">

                                        <Skeleton className="w-[50px] h-[15px]"/>
                                        <Skeleton className="rounded-full w-12 h-12"/>
                                        <Skeleton className="w-[50px] h-[15px]"/>
                                    </div>
                                    <div className="w-full flex flex-col gap-2 ">
                                        <Skeleton className="w-full h-[25px]"/>
                                        <Skeleton className="w-full h-[25px]"/>
                                        <Skeleton className="w-full h-[25px]"/>
                                    </div>
                                </div> 
  )
}
