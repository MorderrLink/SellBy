import { useRouter } from "next/router";
import { useState } from "react";
import { VscSearch } from "react-icons/vsc";
import { Button } from "~/components/ui/button";

import { Input } from "~/components/ui/input"

export default function SearchInput() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const onSearch = (e:React.FormEvent) => {
    e.preventDefault()
    const encodedSearchQuery = encodeURI(searchQuery)
    void router.push({
      pathname: `/search`,
      query: {q: encodedSearchQuery }
    })
  }

  return (

    <form onSubmit={onSearch} className="w-full lg:w-3/5 flex flex-row items-center px-2 py-4">
        <Input value={searchQuery}
          onChange={(e) => { 
            setSearchQuery(e.target.value)}}
          placeholder="I'm looking for..."/>
        <Button className="" variant={"ghost"}><VscSearch className="w-5 h-5" /></Button>
    </form>

  )
}
