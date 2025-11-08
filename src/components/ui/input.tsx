import * as React from "react"

import { cn } from "../../lib/utils"

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'filled' | 'ghost';
  inputSize?: 'sm' | 'md' | 'lg';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = 'default', inputSize = 'md', ...props }, ref) => {
    const baseClasses = "w-full ds-input text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900";
    
    const variantClasses = {
      default: "bg-[#161b26] border-[#21243b] text-white placeholder:text-[#767692]",
      filled: "bg-gray-800 border-transparent text-white placeholder:text-gray-400",
      ghost: "bg-transparent border-transparent text-white placeholder:text-gray-500 hover:border-gray-600"
    };

    const sizeClasses = {
      sm: "h-10 px-4 py-2.5 text-sm",
      md: "h-11 px-5 py-3 text-base",
      lg: "h-12 px-6 py-3.5 text-lg"
    };

    return (
      <input
        type={type}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[inputSize],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }