import { cn } from "~/utils/cn";
 
export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid  grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
        className
      )}
    >
      {children}
    </div>
  );
};
 
export const BentoGridItem = ({
  className,
  title,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;

  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "z-20 row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-2 bg-container-bg-color dark:border-white/[0.2]  border border-transparent justify-between flex flex-col space-y-4",
        className
      )}
    >
      <div className="group-hover/bento:translate-x-2 transition duration-200 flex flex-row items-center justify-center space-x-1 text-3xl">
        {icon}
        <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200">
          {title}
        </div>
      </div>
    </div>
  );
};