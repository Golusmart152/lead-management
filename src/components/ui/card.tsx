import * as React from "react"

import { cn } from "../../lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'subtle' | 'elevated';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  focusable?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'glass', size = 'md', interactive = false, focusable = false, ...props }, ref) => {
    const baseClasses = "ds-card rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 overflow-hidden";
    
    const variantClasses = {
      default: "bg-gray-800 border-gray-700",
      glass: "card-bg-neo bg-opacity-90",
      subtle: "ds-glass-subtle",
      elevated: "ds-glass-surface shadow-2xl"
    };

    const sizeClasses = {
      sm: "p-12 sm:p-16",
      md: "p-16 sm:p-20",
      lg: "p-20 sm:p-24",
      xl: "p-24 sm:p-28"
    };

    const interactiveClasses = interactive
      ? "hover:shadow-lg hover:-translate-y-1 cursor-pointer hover:border-gray-600 active:scale-[0.98]"
      : "";

    const focusableClasses = focusable
      ? "focus:ring-blue-500 focus:ring-offset-gray-900"
      : "";

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          interactiveClasses,
          focusableClasses,
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end';
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, align = 'start', ...props }, ref) => {
    const alignClasses = {
      start: "items-start",
      center: "items-center",
      end: "items-end"
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col space-y-8 pb-16 border-b border-gray-700/50",
          alignClasses[align],
          className
        )}
        {...props}
      />
    );
  }
);
CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, level = 3, ...props }, ref) => {
    const Component = `h${level}` as React.ElementType;
    
    return (
      <Component
        ref={ref}
        className={cn(
          "ds-text-title text-lg sm:text-xl font-bold text-white leading-tight tracking-tight",
          className
        )}
        {...props}
      />
    );
  }
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("ds-text-muted text-sm sm:text-base text-gray-400 leading-relaxed", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, spacing = 'md', ...props }, ref) => {
    const spacingClasses = {
      none: "p-0",
      sm: "p-12 sm:p-16",
      md: "p-16 sm:p-20",
      lg: "p-20 sm:p-24"
    };

    return (
      <div
        ref={ref}
        className={cn(spacingClasses[spacing], "w-full", className)}
        {...props}
      />
    );
  }
);
CardContent.displayName = "CardContent";

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, justify = 'end', ...props }, ref) => {
    const justifyClasses = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around"
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-12 pt-16 border-t border-gray-700/50",
          justifyClasses[justify],
          className
        )}
        {...props}
      />
    );
  }
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }