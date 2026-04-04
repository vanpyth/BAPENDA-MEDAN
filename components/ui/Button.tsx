import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "glass" | "zinc";
  size?: "sm" | "md" | "lg" | "xl" | "icon";
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-95",
      secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 active:scale-95 shadow-sm",
      zinc: "bg-zinc-950 text-white hover:bg-zinc-800 active:scale-95 shadow-xl",
      outline: "border border-zinc-200 bg-white hover:bg-zinc-50 active:scale-95 text-foreground",
      ghost: "hover:bg-zinc-100 text-muted-foreground hover:text-foreground",
      destructive: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 active:scale-95",
      glass: "bg-white/20 backdrop-blur-md border border-white/40 text-foreground hover:bg-white/30 shadow-xl",
    };

    const sizes = {
      sm: "px-4 py-2 text-[10px] uppercase tracking-widest font-black rounded-xl",
      md: "px-6 py-3 text-xs uppercase tracking-widest font-black rounded-2xl",
      lg: "px-8 py-4 text-sm uppercase tracking-widest font-black rounded-2xl",
      xl: "px-10 py-5 text-base uppercase tracking-widest font-black rounded-3xl",
      icon: "p-3 rounded-xl",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
