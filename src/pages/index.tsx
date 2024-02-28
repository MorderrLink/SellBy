
import Link from "next/link"
import { Button } from "~/components/ui/button";
import { Tabs } from "~/components/ui/tabs";
import { Spotlight } from "~/components/ui/Spotlight";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

import { DyncamicContent } from "~/components/ContentRating";
import { FaShoppingBag, FaFutbol, FaTshirt, FaRunning, FaHeadphones, FaHome, FaChild, FaFirstAid , FaHamburger } from 'react-icons/fa';
import { Meteors } from "~/components/ui/meteors";
import { BentoGrid, BentoGridItem } from "~/components/ui/BentoGrid";
import ContentChoosing from "~/components/ContentChoosing";
import { api } from "~/utils/api";
import { useEffect } from "react";



const categories = [
{ name: "Tech", icon: <FaHeadphones /> },
{ name: "Electronic", icon: <FaShoppingBag /> },
{ name: "Footwear", icon: <FaRunning /> },
{ name: "Kids", icon: <FaChild /> },
{ name: "Household", icon: <FaHome /> },
{ name: "Food", icon: <FaHamburger /> },
{ name: "Sport", icon: <FaFutbol /> },
{ name: "Clothes", icon: <FaTshirt /> },
{ name: "Medicine", icon: <FaFirstAid  /> },
];







export default function Home(props: any) {
  
  // console.log(props.ip)


  const IpMutation = api.unknowns.createNewVisitor.useMutation()

  useEffect(() => {
    IpMutation.mutate({ ip: props.ip })
  }, [props.ip])

  const tabs = [
    {
      title: "Explore",
      value: "product",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-1 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-orange-400 to-red-700 ">
          <div className="w-full h-full overflow-hidden relative rounded-xl p-10 text-xl md:text-4xl font-bold text-white bg-card-bg-color ">
            <p className="text-shadow">Buy your dream</p>
            <p className="text-2xl text-text-secondary-color">just in a few clicks</p>
        
            <Card className="box-border overflow-hidden flex flex-col gap-0 justify-center  h-[500px] w-full md:w-[250px] md:h-[400px] lg:w-[300px] lg:h-[450px] xl:w-[350px] xl:h-[500px] space-y-0 bg-card-bg-color border-bg-card-bg-color shadow-lg shadow-bg-card-bg-color">
                <CardHeader>
                    <CardTitle className="flex flex-col items-start justify-center gap-2">
                        <div><h1 suppressHydrationWarning className="text-gradient text-red-100">Wow!</h1></div>
                        <div className="flex flex-row gap-2 w-full justify-start px-2">
                            <Skeleton className='w-2/6 h-[20px] rounded-lg'/>
                            <Skeleton className='w-2/6 h-[20px] rounded-lg'/>
                            <Skeleton className='w-2/6 h-[20px] rounded-lg'/>
                        </div>
                        
  
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-row items-center justify-center  space-x-4 w-[300px] lg:w-auto">
                <div className='flex flex-row items-center justify-center'>
                  <img className='h-[250px] w-[250px] sm:h-[200px] sm:w-[200px] md:h-[250px] md:w-[250px] lg:h-[250px] lg:w-[250px] flex items-center justify-center rounded-xl' src="/surprise.png"/>
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
          </div>
        </div>
      ),
    },
    
    {
      title: "Rating",
      value: "playground",
      content: <div>
        <DyncamicContent/>
      </div>
    },
    {
      title: "Categories",
      value: "content",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-1 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-blue-600 to-rose-700">
          <div className="w-full h-full overflow-hidden relative rounded-xl p-10 text-xl md:text-4xl font-bold text-white bg-card-bg-color text-shadow space-y-2">
            <p>Search in popular categories</p>
            <BentoGrid>
              {categories.map((category, i) => {
                return <BentoGridItem key={i}  icon={category.icon} title={category.name} className={`${i == 1  && "col-span-2"} ${i == 2 && "col-span-2"} ${i == 4 && "col-span-2"} ${i == 7 && "col-span-2"} ${i == 8 && "col-span-3"}`}/>
              })}
            </BentoGrid>
            
            <Meteors number={52} />
          </div>
        </div>
      ),
    },
    {
      title: "Order",
      value: "services",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-1 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-violet-800 to-blue-700 ">
          <div className="w-full h-full overflow-hidden relative rounded-xl p-10 text-xl md:text-4xl font-bold text-white bg-card-bg-color ">
            <p className="text-shadow">How everything works?</p>
            <ContentChoosing/>
          </div>
        </div>
      ),
    },
    
  ];
















  const session = useSession()



  return (
    
      <div className="body-background rounded-lg lg:mx-5 lg:p-4 mx-0 py-2 px-[2px]  h-full w-full flex flex-col items-center justify-center lg:justify-around bg-container-bg-color">
        <div className="flex flex-col lg:flex-row justify-around md:pb-60 z-10 lg:z-0 min-h-screen w-full px-5 py-2 mb-20">
            
          <div className="w-full lg:w-1/3 lg:p-4 flex flex-col justify-center">
            <Spotlight className="lg:-top-72 hidden md:block left-0" />
            <h1 className="text-7xl font-bold mb-2">Find anything here</h1>
            <h5 className="text-4xl font-semibold mb-4">even something you don't expect...</h5>

            <div className="body-background  bg-black p-4 rounded-lg">
              <h1 className="text-2xl font-bold mb-2">Our service</h1>
              <p className="text-gray-700 mb-2">made for both clients and entrepreneurs in order to help them contact easily</p>
              <ul className="list-disc list-inside text-gray-500">
                <li className="mb-1">~ Efficient recommendations system</li>
                <li className="mb-1">~ Convenient product placement</li>
                <li className="mb-1">~ Product verification</li>
              </ul>

            </div>
            <div className="w-full py-4 space-y-4">
              <h1 className="text-5xl font-bold ">Check yourself how it works and start using A.S.A.P.</h1>
              <div className="flex flex-row gap-2 w-full justify-center">
                <Button size={"lg"} variant={"default"} className="bg-nav-text-color">
                    <Link href={"/search"}>Start Exploring</Link>
                </Button>
                <Button size={"lg"} variant={"link"} className="border-[1px] border-text-secondary-color">
                    {session.status == "authenticated" ? <Link href={`account/${session.data.user.name}`}>Go to Account</Link>  : <Link href={`/login`}>Login via Discord</Link>}
                </Button>
              </div>
            </div>
          </div>

          
        <div className="hidden lg:block">
          <Tabs tabs={tabs}/>
        </div>

        <div className=" lg:hidden flex flex-col gap-1 w-full">

          <div className="w-full overflow-hidden relative h-max rounded-2xl p-[1px] text-lg md:text-2xl font-bold text-white bg-gradient-to-br from-orange-400 to-red-700 ">
            <div className="w-full h-full overflow-hidden relative rounded-xl p-[2px] text-lg md:text-2xl font-bold text-white bg-card-bg-color ">
              <p className="text-shadow">Buy your dream</p>
              <p className="text-2xl text-text-secondary-color">just in a few clicks</p>
          
              <Card className="box-border overflow-hidden flex flex-col gap-0 justify-center items-center h-[500px] w-full md:w-[250px] md:h-[400px] lg:w-[300px] lg:h-[450px] xl:w-[350px] xl:h-[500px] space-y-0 bg-card-bg-color border-bg-card-bg-color shadow-lg shadow-bg-card-bg-color">
                  <CardHeader>
                      <CardTitle className="flex flex-col items-start justify-center gap-2">
                          <div className="flex justify-center items-center"><h1 suppressHydrationWarning className="text-gradient text-red-100 text-center">Wow!</h1></div>
                          <div className="flex flex-row gap-2 w-full justify-start px-2">
                              <Skeleton className='w-[70px] h-[20px] rounded-lg'/>
                              <Skeleton className='w-[70px] h-[20px] rounded-lg'/>
                              <Skeleton className='w-[70px] h-[20px] rounded-lg'/>
                          </div>
                          
    
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-row items-center justify-center  space-x-4 w-[300px] lg:w-auto">
                  <div className='flex flex-row items-center justify-center'>
                    <img className='h-[250px] w-[250px] sm:h-[200px] sm:w-[200px] md:h-[250px] md:w-[250px] lg:h-[250px] lg:w-[250px] flex items-center justify-center rounded-xl' src="/surprise.png"/>
                  </div>
                  </CardContent>
                  
    
                  <div className="flex flex-row gap-2 py-2 w-full justify-start px-5">
                    <Skeleton className='px-2 py-1 rounded-lg w-[80px] h-[20px]'/>
                  </div>
                  
                  
                  <CardFooter className="flex gap-2">
                  <Skeleton className='px-2 py-1 rounded-lg w-[100px] h-[30px]'/>
                  <Skeleton className='px-2 py-1 rounded-lg w-[100px] h-[30px]'/>
                  </CardFooter>
              </Card>
            </div>
          </div>

          <DyncamicContent/>

          <div className="w-full overflow-hidden relative h-max rounded-2xl p-1 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-blue-600 to-rose-700">
            <div className="w-full h-full overflow-hidden relative rounded-xl p-2 text-xl md:text-4xl font-bold text-white bg-card-bg-color text-shadow space-y-2">
              <p>Search in popular categories</p>
              <BentoGrid>
                {categories.map((category, i) => {
                  return <BentoGridItem key={i}  icon={category.icon} title={category.name} className={`${i == 1  && "col-span-2"} ${i == 2 && "col-span-2"} ${i == 4 && "col-span-2"} ${i == 7 && "col-span-2"} ${i == 8 && "col-span-3"}`}/>
                })}
              </BentoGrid>
              
              <Meteors number={52} />
            </div>
          </div>


          <div className="w-full overflow-hidden relative h-max rounded-2xl p-1 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-violet-800 to-blue-700 ">
            <div className="w-full h-full overflow-hidden relative rounded-xl p-2 text-xl md:text-4xl font-bold text-white bg-card-bg-color ">
              <p className="text-shadow">How everything works?</p>
              <ContentChoosing/>
            </div>
          </div>



        </div>
      </div>


      
    </div>
  )
}

export async function getServerSideProps(context: any) {
  let ip;
 
  const { req } = context;
 
  if (req.headers['x-forwarded-for']) {
     ip = req.headers['x-forwarded-for'].split(',')[0];
  } else if (req.headers['x-real-ip']) {
     ip = req.connection.remoteAddress;
  } else {
     ip = req.connection.remoteAddress;
  }
 
  return {
     props: {
       ip,
     },
  };
 }