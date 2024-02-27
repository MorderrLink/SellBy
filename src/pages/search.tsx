import { useSearchParams } from "next/navigation";
import InfiniteScroll from "~/components/InfiniteScroll";
import { FaSearch, FaShoppingBag, FaFutbol, FaTshirt, FaRunning, FaHeadphones, FaHome, FaChild, FaFirstAid , FaHamburger } from 'react-icons/fa';
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";

export default function search() {
  const query = useSearchParams().get("q")
  const [activeCategory, setActiveCategory] = useState<string>('');

  const categories = [{ name: "Sport", icon: <FaFutbol /> },
  { name: "Tech", icon: <FaHeadphones /> },
  { name: "Clothes", icon: <FaTshirt /> },
  { name: "Footwear", icon: <FaRunning /> },
  { name: "Electronic", icon: <FaShoppingBag /> },
  { name: "Household", icon: <FaHome /> },
  { name: "Kids", icon: <FaChild /> },
  { name: "Medicine", icon: <FaFirstAid  /> },
  { name: "Food", icon: <FaHamburger /> }];

  useEffect(() => {
    setActiveCategory("")
  }, [])


  return (
    <div className="body-background rounded-lg mx-5 p-4 lg:p-10  h-full w-full flex flex-col items-start justify-start bg-container-bg-color">
      <div className="w-full flex justify-center items-center gap-2 p-2">
        <FaSearch className="w-8 h-8"/>
        {(query != "" && !!query) 
             ? <h1 className="text-2xl font-medium ">Results for <span className="font-mono">{query.length > 20 ? query.slice(0,17)+"..." : query}</span></h1>
             : <h1 className="text-xl font-medium ">Search for products here</h1>
            }
      </div>
      
      {activeCategory == "" ? <div className="w-full flex flex-wrap justify-center p-8">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => setActiveCategory(category.name)}
            className={`m-2 px-4 py-2 border rounded flex items-center justify-center ${activeCategory === category.name ? 'bg-nav-bg-color text-text-main-color' : 'bg-secondary-bg-color text-text-secondary-color'}`}
          >
            {category.icon}
            <span className="ml-2">{category.name}</span>
          </button>
        ))}
      </div>
      : <div className="px-2 py-4 w-full flex flex-row items-center justify-center gap-5">
          <h1 className="font-medium text-text-main-color ">Looking in category: {activeCategory}</h1>
          <Button onClick={() => { setActiveCategory("") }}>Clear filter</Button>
        </div>}


      <InfiniteScroll favourite={false} category={activeCategory}/>
    </div>
  )
}
