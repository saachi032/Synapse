import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#7C3AED] to-[#FF81FF] text-primary-foreground shadow-[0_0_25px_rgba(124,58,237,0.35)] hover:shadow-[0_0_35px_rgba(124,58,237,0.55)] hover:-translate-y-[2px] active:scale-[0.96]",
        outline:
          "border border-[rgba(255,255,255,0.12)] bg-transparent text-foreground hover:bg-white/5",
        ghost: "bg-transparent text-muted-foreground hover:bg-white/5",
        secondary:
          "border border-[rgba(255,255,255,0.08)] bg-[rgba(17,17,24,0.6)] text-foreground hover:bg-white/5",
        destructive:
          "bg-[#ef4444] text-destructive-foreground hover:bg-[#f97373]",
      },
      size: {
        default: "h-10 px-4", // ~40–44px
        sm: "h-9 px-3 text-xs",
        lg: "h-10 px-5",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

