import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-w-0 max-w-full overflow-hidden text-center leading-tight",
  {
    variants: {
      variant: {
        default: "btn-accent",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.98]",
        outline: "border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:border-[var(--color-text-secondary)] active:scale-[0.98]",
        secondary: "bg-transparent text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-bg-hover)] hover:border-[var(--color-text-secondary)] active:scale-[0.98]",
        ghost: "hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] active:scale-[0.98]",
        link: "btn-link",
        success: "bg-green-600 text-white hover:bg-green-700 shadow active:scale-[0.98]",
        warning: "bg-yellow-600 text-white hover:bg-yellow-700 shadow active:scale-[0.98]",
        error: "bg-red-600 text-white hover:bg-red-700 shadow active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm sm:text-base",
        sm: "h-9 px-3 py-1.5 text-sm",
        lg: "h-11 px-8 py-3 text-base sm:text-lg",
        icon: "h-10 w-10",
        xl: "h-12 px-10 py-4 text-lg sm:text-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
