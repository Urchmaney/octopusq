import { ComponentProps } from "react";
import { cn } from "../../utils";

export function SecondaryButton(props: ComponentProps<"button">) {
  const { className, ...others } = props;

  return <button {...others} type="submit" className={cn(className, "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-10 px-4 w-full bg-[#ffc145] py-6 text-white hover:bg-[#d6b46ff5]")}>
  </button>
}