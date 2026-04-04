import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "elevated" | "flat" | "glass" | "gradient" | "outline";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "outline", padding = "md", children, ...props }, ref) => {
    const variants = {
      /* ── All variants now use Light/Professional base colors ── */
      outline: "bg-white border border-zinc-100 shadow-sm transition-all duration-500",
      elevated: "bg-white border border-zinc-50 shadow-2xl shadow-primary/5 hover:shadow-primary/10 transition-all duration-500",
      flat: "bg-zinc-50 border border-transparent shadow-inner",
      glass: "bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-primary/5",
      gradient: "bg-gradient-to-br from-white to-zinc-50 border border-zinc-100",
    };

    const paddings = {
      none: "p-0",
      sm: "p-4 md:p-6",
      md: "p-6 md:p-8",
      lg: "p-8 md:p-10",
      xl: "p-10 md:p-14",
    };

    const cornerRadius = "rounded-[2.5rem] lg:rounded-[3rem]";

    return (
      <div
        ref={ref}
        className={cn(
          cornerRadius,
          variants[variant],
          paddings[padding],
          "relative overflow-hidden",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export const CardHeader = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 mb-6 md:mb-8", className)} {...props}>{children}</div>
);

export const CardTitle = ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("text-2xl md:text-3xl font-black tracking-tight text-foreground italic", className)} {...props}>{children}</h3>
);

export const CardDescription = ({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-muted-foreground font-medium text-sm md:text-base leading-relaxed mt-2 italic", className)} {...props}>{children}</p>
);

export const CardContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("", className)} {...props}>{children}</div>
);

export const CardFooter = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center pt-8 md:pt-10 mt-8 md:mt-10 border-t border-zinc-100", className)} {...props}>{children}</div>
);
