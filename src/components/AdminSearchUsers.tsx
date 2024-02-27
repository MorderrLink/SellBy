
import { useEffect, useRef, useState } from "react";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { api } from "~/utils/api";
import { Skeleton } from "./ui/skeleton";


export default function AdminSearchUsers() {
    const [users, setUsers] = useState<{name: string, image: string | null}[] | undefined>(undefined)
    const [inputState, setInputState] = useState("")
    const [filterUsers, setFilterUsers] = useState<{name: string, image: string | null}[] | undefined>(undefined)
    const [dataLoading, setDataLoading] = useState<boolean>(true)
    const loader = useRef(null)
    const [page, setPage] = useState(1)
    const userData = api.admin.getUsers.useQuery({page: page}).data

    useEffect(() => {
        
        if (userData && userData.users.length > 0 && userData.hasMore ) {
            setUsers(prev => [...(prev ?? []), ...(Array.isArray(userData.users) ? userData.users : [])]);
            setDataLoading(false)
        }
    }, [userData])

    useEffect(() => {
        
        setFilterUsers(() => {
            if (inputState == "") {
                return users
            }
            const usersToFilter = users
            const filtered = usersToFilter?.filter((user) => user.name.toLowerCase().includes(inputState.toLowerCase()));
            return filtered;
        });
        
    }, [inputState, users])


    const loadMoreItems = () => {
        if (userData?.hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };



    useEffect(() => {
        if (!dataLoading && loader.current && userData?.hasMore) {
            const options = {
                root: null,
                rootMargin: '0px',
                threshold: 1.0
            };
            
            const observer = new IntersectionObserver(handleObserver, options);
            observer.observe(loader.current);
            return () => {
                if (loader.current) {
                 observer.unobserve(loader.current);
                }
            };
        }
    }, [dataLoading]);
 
    const handleObserver = (entities:any, observer:any) => {
        const target = entities[0];
        if (target.isIntersecting) {
          loadMoreItems();
        }
    };





  return (
    <div className="w-full flex flex-col justify-center items-center border-[1px] rounded-[7px] border-text-secondary-color p-[10px]  gap-5">
        <Input  onChange={(e) => setInputState(e.currentTarget.value)} placeholder="Enter username" className="border-[1px] border-text-secondary-color rounded-[10px]"/>
        <ScrollArea className="w-full min-h-[350px] h-[350px] border-[1px] border-text-secondary-color rounded-[10px] overflow-auto">
            {dataLoading ? <div className="w-full flex flex-col justify-center items-center p-2 gap-2">
                            <div className="w-full flex flex-row justify-start items-center gap-3 px-5 py-2 rounded-md border-[1px] border-nav-bg-color">
                                <Skeleton className="w-16 h-16 rounded-full"/>
                                <Skeleton className="w-[30%] h-5"/>
                           </div>
                           <div className="w-full flex flex-row justify-start items-center gap-3 px-5 py-2 rounded-md border-[1px] border-nav-bg-color">
                                <Skeleton className="w-16 h-16 rounded-full"/>
                                <Skeleton className="w-[30%] h-5"/>
                           </div>
                </div>
                : <div className="w-full flex flex-col justify-center items-center p-2 gap-2">
                {   (filterUsers && filterUsers.length > 0) ? filterUsers?.map(user => {
                    return (
                        <div key={user.name} className="w-full flex flex-row justify-start items-center gap-3 px-5 py-2 rounded-md border-[1px] border-nav-bg-color">
                            <img src={user.image ?? ""} alt="USER PHOTO" className="w-16 h-16 rounded-full" />
                            <h1 className="text-2xl font-medium">{ user.name }</h1>
                        </div>
                    )
                }) : <div>
                        No Users Matching
                    </div>}
                </div> 
                        
                }
                <div ref={loader}></div>
                
        </ScrollArea>
        
    </div>
  )
}
