

type ContainerProps = {
    children?: React.ReactNode;
    direction: string;
    classNames?: string;
    wid?: string;
}

export default function Container({children, direction, classNames, wid}: ContainerProps) {
  return (
    <div className={`h-auto w-screen min-h-full lg:min-h-screen  ${wid ? wid : " lg:w-3/5"} flex  flex-${direction == "col" ? "col items-center " : "row justify-center "} ${classNames} overflow-x-hidden`} >
      {children}
    </div>
  )
}
