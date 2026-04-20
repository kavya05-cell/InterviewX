import * as React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50"
  
  const variants = {
    default: "bg-primary-gradient text-primary-foreground shadow hover:opacity-90",
    destructive: "bg-red-500 text-white hover:bg-red-500/90 shadow-sm",
    outline: "border border-glass bg-transparent shadow-sm hover:bg-white/5",
    secondary: "bg-white/10 text-white hover:bg-white/20",
    ghost: "hover:bg-white/10 text-gray-300 hover:text-white",
    link: "text-primary underline-offset-4 hover:underline",
  }

  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-12 rounded-md px-8 text-base",
    icon: "h-9 w-9",
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
