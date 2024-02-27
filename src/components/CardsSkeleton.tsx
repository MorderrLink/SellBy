import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Skeleton } from "~/components/ui/skeleton";

export default function CardsSkeleton() {
  return (
    <Card className="box-border overflow-hidden flex flex-col gap-0 justify-center  h-[500px] w-full md:w-[250px] md:h-[400px] lg:w-[300px] lg:h-[450px] xl:w-[350px] xl:h-[500px] space-y-0 bg-card-bg-color border-bg-card-bg-color shadow-lg shadow-bg-card-bg-color">
        <CardHeader>
            <CardTitle className="flex flex-col items-start justify-center gap-2">
                <Skeleton className="w-full h-[30px] rounded-full" /> 
                <div className="flex flex-row gap-2 w-full justify-start px-2">
                    <Skeleton className='w-2/6 h-[20px] rounded-lg'/>
                    <Skeleton className='w-2/6 h-[20px] rounded-lg'/>
                    <Skeleton className='w-2/6 h-[20px] rounded-lg'/>
                </div>
                

            </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-row items-center justify-center  space-x-4 w-[300px] lg:w-auto">
        <div className='flex flex-row items-center justify-center'>
          <Skeleton className='h-[250px] w-[250px] sm:h-[200px] sm:w-[200px] md:h-[250px] md:w-[250px] lg:h-[250px] lg:w-[250px] flex items-center justify-center rounded-xl'/>
        </div>
        </CardContent>
        

        <div className="flex flex-row gap-2 py-2 w-full justify-start px-5">
          <Skeleton className='px-2 py-1 rounded-lg w-[80px] h-[30px]'/>
        </div>
        
        
        <CardFooter className="flex gap-2">
        <Skeleton className='px-2 py-1 rounded-lg w-5/12 h-[40px]'/>
        <Skeleton className='px-2 py-1 rounded-lg w-5/12 h-[40px]'/>
        </CardFooter>
    </Card>
  )
}
