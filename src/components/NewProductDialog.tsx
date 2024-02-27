
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "~/components/ui/dialog"
  import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";

import { type FileState, MultiImageDropzone } from "./MultiImage"
import { useEdgeStore } from "~/lib/edgestore";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
 
import {
ToggleGroup,
ToggleGroupItem,
} from "~/components/ui/toggle-group"
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { Reorder } from "framer-motion";


function UpdateTextAreaSize(textArea?: HTMLTextAreaElement) {
    if (textArea === null) return;
    if (textArea === undefined) return;
    textArea.style.height = "0";
    textArea.style.height = `${textArea?.scrollHeight}px`;
}


const CATEGORIES = ["Sport", "Tech", "Clothes", "Footwear", "Electronic", "Household", "Kids", "Medicine", "Food"]



export default function NewProductDialog() {
    const session = useSession()
    const utils = api.useContext()
    const [open, setOpen] = useState(false);

    const nameInputRef = useRef<HTMLInputElement | null>(null)
    const priceInputRef = useRef<HTMLInputElement | null>(null)

    const keyRef = useRef<HTMLInputElement | null>(null)
    const valueRef = useRef<HTMLInputElement | null>(null)

    const [error, setError] = useState<string>("")
    const [inputValue, setInputValue] = useState("")
    const textAreaRef = useRef<HTMLTextAreaElement>();
    const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
        UpdateTextAreaSize(textArea);
        textAreaRef.current = textArea;
    }, [])

    type charactesitsicType = {
        key: string | undefined;
        value: string | undefined;
        index: number;
    }

    const [charactesitsics, setCharactesitsics] = useState<charactesitsicType[]>([])

    function handleReorder(newOrder: charactesitsicType[]) {
        setCharactesitsics(newOrder.map((value, index) => ({
          ...value,
          index: index 
        })));
      }


    useLayoutEffect(() => {
        UpdateTextAreaSize(textAreaRef.current);
    }, [inputValue])

    const CreateProduct = api.product.createProduct.useMutation({
        onSuccess() {
            utils.product.getProductsByUserId.invalidate()
        }
    })
    const CreateProductImage = api.product.createProductImages.useMutation({
        onSuccess() {
            utils.product.getProductsByUserId.invalidate()
        }
    })
    const CreateCharacteristic = api.product.createCharacteristic.useMutation()

    const [fileStates, setFileStates] = useState<FileState[]>([]);
    const { edgestore } = useEdgeStore();

    const [toggleItems, setToggleItems] = useState<string[]>([])
    
    function addToggleItem(category:string) {
        if (toggleItems.includes(category)) {
            setToggleItems((toggleItems) => toggleItems.filter(toggleItem => toggleItem != category))
        } else {
            setToggleItems([...toggleItems, category])
        }
    }

    function updateFileProgress(key: string, progress: FileState['progress']) {
        setFileStates((fileStates) => {
          const newFileStates = structuredClone(fileStates);
          const fileState = newFileStates.find(
            (fileState) => fileState.key === key,
          );
          if (fileState) {
            fileState.progress = progress;
          }
          return newFileStates;
        });
      }

    
    if ((session.data?.user === undefined) || (session.data?.user.id === undefined)) return

    async function ValidateData() {
    if (session.data?.user.id === undefined) return false 

    if (fileStates.length == 0) {
        setError("Product must have at least one photo!")
        return false
    }
    if (!nameInputRef.current?.value) {
        setError("Product must have name!")
        return false
    }
    if (toggleItems.length == 0) {
        setError("Product should belong to at least 1 category!")
        return false
    }
    if (toggleItems.length > 3) {
        setError("Product should belong to less than 4 categories!")
        return false
    }
    if (!priceInputRef.current?.value) {
        setError("Product must have price!")
        return false
    }
    if (+priceInputRef.current?.value === 0) {
        setError("Product can't be free!")
        return false 
    }
    if (error !== "") {
        return false
    }
    if (error === "") return true
    }

    function validateCharacteristic() {
        if (keyRef.current?.value == "" ?? keyRef.current === null) {
            setError("KEY field cannot be empty")
            return false
        } 
        if (valueRef.current?.value == "" ?? valueRef.current === null) {
            setError("VALUE field cannot be empty")
            return false
        }
        if (valueRef.current?.value.length > 35) {
            setError("Characteristics should be SHORT and informative!")
            return false
        }
        if (keyRef.current?.value.length > 25) {
            setError("Characteristics should be SHORT and informative!")
            return false
        }
        return true
    }


    function addCharacteristic() {
        
        if (validateCharacteristic() == true && keyRef.current && valueRef.current) {
            setCharactesitsics(prev => [...prev, {key: keyRef.current?.value, value: valueRef.current?.value, index: Math.round(Math.random() * 10000)}])
            keyRef.current.value = ""
            valueRef.current.value = ""
            setError("")
        }
        
        
    }


      async function handleSubmit(e:React.FormEvent) {
        e.preventDefault()
        setError("")
        if (!await ValidateData()) return
        if (nameInputRef.current?.value == undefined) return
        if (session.data?.user.id == undefined) return
        if (priceInputRef.current?.value == undefined) return

        const ProductID = await CreateProduct.mutateAsync({
            name: nameInputRef.current?.value,
            userId: session.data?.user.id,
            price: +priceInputRef.current?.value,
            description: inputValue,
            categories: toggleItems
        })

        fileStates.map(async (file) => { 
            if (typeof file.file == "string") return
            const res = await edgestore.publicFiles.upload({file: file.file})
            await CreateProductImage.mutateAsync({
                productId: ProductID,
                url: res.url
            })
        })

        charactesitsics.map(async (charactesitsic) => {
            if (charactesitsic.key !== undefined && charactesitsic.value !== undefined) {
                await CreateCharacteristic.mutateAsync({
                    productId: ProductID,
                    key: charactesitsic.key,
                    value: charactesitsic.value
                })

            }
        })

        nameInputRef.current.value = ""
        priceInputRef.current.value = ""
        setToggleItems([])
        setInputValue("")
        
        setOpen(false)
        setFileStates([])
        
    }


    return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>Place new product</DialogTrigger>
        <DialogContent className="bg-secondary-bg-color h-max overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-semibold text-xl">
                New product
            </DialogTitle>
            
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 items-start">
                <div>
                    <h1 className="font-medium ">Add some pictures of your product</h1>
                    <p className="font-medium text-sm text-[#f9f9fc]">You can add maximum of 6 files</p>
                </div>
                <div className="w-full max-h-96">
                    <MultiImageDropzone
                    value={fileStates}
                    dropzoneOptions={{
                        maxFiles: 6,
                    }}
                    onChange={(files) => {
                        setFileStates(files);
                    }}
                    onFilesAdded={async (addedFiles) => {
                        setFileStates([...fileStates, ...addedFiles]);}}
                        />
                </div>

                <div className="w-full">
                    <h1 className="font-medium ">Give your product a name</h1>
                    <Input ref={nameInputRef} placeholder="Type here..." className="w-full text-[#504da8] text-lg font-medium" />
                    <p className="font-medium text-sm text-[#f9f9fc]">Max length is 30 symbols</p>
                </div>

                <div className="w-full">
                    <textarea
                    name="newTweet" 
                    ref={inputRef}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-grow resize-none overflow-hidden p-2 w-full max-h-40 overflow-y-auto text-base border-zinc-100 shadow-xl border-2 outline-none rounded-lg" 
                    placeholder="Give a short description of the product"/>
                </div>
                
                <div className="w-full flex flex-wrap flex-col gap-2">
                <h1 className="font-medium">Choose from 1 to 3 categories that your product belongs to</h1>
                <ToggleGroup type="multiple" className="flex flex-wrap">
                    {CATEGORIES.map((category, index) => {
                        return (
                            <ToggleGroupItem key={index}  value={category} onClick={() => { addToggleItem(category) }}>
                            <h1>{category}</h1>
                        </ToggleGroupItem>)
                    })}
                    
                    
                </ToggleGroup>
                </div>

                <div className="w-full">
                    <h1 className="font-medium">What will be the price?</h1>
                    <p className="font-medium text-sm text-[#f9f9fc]">State the prise in USD</p>
                    <Input ref={priceInputRef} type="number"/>
                </div>
                <div className="w-full gap-2">
                    <h1 className="font-medium">Add as many charactesitsics as you can</h1>
                    <p className="font-medium text-sm text-[#f9f9fc]">Each charactesitsic should be short, but informative!</p>
                    <div className="flex flex-row gap-1">
                        <Input ref={keyRef} placeholder="characteristic"/>
                        <Input ref={valueRef} placeholder="value"/>
                    </div>
                    <Button type="button" className="w-full mt-2" onClick={addCharacteristic} >Add</Button>
                    <ScrollArea className="max-h-[150px] overflow-y-auto my-2 whitespace-nowrap rounded-md border">
                        <Reorder.Group axis="y" onReorder={(e) => { setCharactesitsics(e) }} values={charactesitsics} >
                            {charactesitsics.map(char => {
                                return <Reorder.Item  key={char.key} value={char} className="p-1 flex flex-row gap-1">
                                    <Input className="border-none shadow-xl text-text-main-color" value={char.key} disabled/>
                                    <div className="border-l-[1px] border-black border-opacity-10 "></div>
                                    <Input className="border-none shadow-xl text-text-main-color" value={char.value} disabled/>
                                    <Button onClick={() => setCharactesitsics(prev => prev.filter(item => item.index != char.index))}>Delete</Button>
                                </Reorder.Item>
                            })}
                        </Reorder.Group>
                        <ScrollBar orientation="vertical"/>
                    </ScrollArea>
                </div>
                {(error !== "") && 
                <div>
                     {error}   
                </div>}
            <Button type="submit">Submit</Button>
            </form>
            
          </DialogHeader>
        </DialogContent>
      </Dialog>
                
  )
}

