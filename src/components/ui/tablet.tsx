

type tabletProps = {
    text: string;
    color?: string;
}

export default function Tablet({text, color}: tabletProps) {
  return (
    <div className={`w-16 md:w-20 lg:w-28 h-5 lg:h-10 flex items-center justify-center px-3 py-2 rounded-2xl ${color ?? "bg-tab-bg-color bg-opacity-30"} bg-tab-bg-color shadow-xl `}>
        <h4 className="font-normal md:font-medium lg:font-bold sm:text-sm md:text-base lg:text-lg  text-text-secondary-color">{text}</h4>
    </div>
  )
}
