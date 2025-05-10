import { RefObject } from "react"
import { cn } from "../../utils"

export function Card(props: React.ComponentProps<"div"> & { ref?: RefObject<HTMLDivElement> }) {
  const { className, ref, ...others } = props;
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...others}
    />
  )
}
Card.displayName = "Card"

export function CardHeader(props: React.ComponentProps<"div"> & { ref?: RefObject<HTMLDivElement> }) {
  const { className, ref, ...others } = props;
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...others}
    />
  )
}
CardHeader.displayName = "CardHeader"

export function CardTitle(props: React.ComponentProps<"div"> & { ref?: RefObject<HTMLDivElement> }) {
  const { className, ref, ...others } = props;
  return (
    <div
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...others}
    />
  )
}
CardTitle.displayName = "CardTitle"

export function CardDescription(props: React.ComponentProps<"div"> & { ref?: RefObject<HTMLDivElement> }) {
  const { className, ref, ...others } = props;
  return (
    <div
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...others}
    />
  )
}
CardDescription.displayName = "CardDescription"

export function CardContent(props: React.ComponentProps<"div"> & { ref?: RefObject<HTMLDivElement> }) {
  const { className, ref, ...others } = props;
  return (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...others} />
  )
}
CardContent.displayName = "CardContent"


export function CardFooter(props: React.ComponentProps<"div"> & { ref?: RefObject<HTMLDivElement> }) {
  const { className, ref, ...others } = props;
  return (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...others} />
  )
}
CardFooter.displayName = "CardFooter"

