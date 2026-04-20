import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Badge = ({ className, variant = "default", ...props }) => {
  const variants = {
    default: "border-transparent bg-primary/20 text-primary hover:bg-primary/30",
    secondary: "border-transparent bg-gray-800 text-gray-100 hover:bg-gray-700",
    destructive: "border-transparent bg-red-500/20 text-red-500 hover:bg-red-500/30",
    outline: "text-foreground border-glass hover:bg-gray-800/50",
    success: "border-transparent bg-green-500/20 text-green-500 hover:bg-green-500/30"
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
