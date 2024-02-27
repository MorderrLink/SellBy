import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "~/components/ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input";
import  { useRef, useState } from "react";
import type { FormEvent } from "react";
import { api } from "~/utils/api";
import { useEdgeStore } from "~/lib/edgestore";
import { useRouter } from "next/router";
import { toast } from "sonner";


type DeleteProps = {
    productName: string;
    productId: string;
    images: {
        id:string;
        url: string;
        productId: string;
        
    }[];
    isAdmin?: boolean;
    isApproval?: boolean;
    className?: string;
    onDeleteSuccess?: (productId: string) => void;
}

export default function DeleteDialog({productName, productId, images, isAdmin, isApproval, className, onDeleteSuccess}: DeleteProps) {
    const { edgestore } = useEdgeStore()
    const utils = api.useContext()
    const router = useRouter()
    const [opened, setOpened] = useState<boolean>(false)
    const deleteInputRef = useRef<HTMLInputElement | null>(null)
    const DeleteMutation = api.product.deleteProduct.useMutation({
        async onSuccess() {
            await utils.product.getProductsByUserId.invalidate()
            await utils.admin.getProducts.invalidate()
        }
    })

    function deleteProduct(e:FormEvent) {
        e.preventDefault()
        if (productName == deleteInputRef.current?.value) {

            images.map( async (image) => {
                await edgestore.publicFiles.delete({
                    url: image.url,
                  });
            })

            DeleteMutation.mutate({productId: productId}, {onSuccess(){
                // utils.admin.getApproval.invalidate();
                // utils.admin.getProducts.invalidate();
                if (onDeleteSuccess != undefined) {
                    onDeleteSuccess(productId);
                }
            }})
            if (isApproval) {
                toast.error("Product dissaproved")
            } else {
                if (!isApproval && !isAdmin) {
                    router.back()
                    console.log("router.back()")
                }
                toast.info("Deleting product...")
            }

            
        }
    }

  return (
    <div>
        <Dialog open={opened} onOpenChange={() => { setOpened(!opened) }}>
        <DialogTrigger onClick={() => { setOpened(true) }} className={`bg-transparent  text-red-700 hover:text-white hover:bg-red-700 px-2 py-1 border-2 border-red-500 rounded-lg ${className}`}>{isApproval ? "Dissaprove" : "Delete product"}</DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
                {isAdmin ? "Is this product really violates service policy and cannot be sold here?" : "This action cannot be undone. This will permanently delete your product and remove data from our servers."}
            </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-1">
                <label htmlFor="deleteInput">Type in <span className="font-bold">"{productName}"</span> to confirm</label>
                <Input ref={deleteInputRef} id="deleteInput"/>
                <Button type="button" onClick={(e:FormEvent) => {
                    deleteProduct(e)
                    setOpened(false)
                }}>Delete</Button>
            </div>
        </DialogContent>
        </Dialog>
    </div>
  )
}
