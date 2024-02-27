import React from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/components/ui/dialog";

type ImageModalProps = {
    imageSrc: string;
    altText?: string;
    children: React.ReactNode;
    sizes?: string;
}

export default function ImageModal({ imageSrc, altText, children, sizes }: ImageModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className={`${sizes ?? "max-w-6xl"} mx-auto  p-6 md:p-4 lg:p-8`}>
        <img src={imageSrc} alt={altText ?? "Image"} className="w-full h-auto aspect-square" />
      </DialogContent>
    </Dialog>
  );
}