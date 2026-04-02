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
          "bg-[linear-gradient(135deg,#f9f6fa_0%,#dcccf7_48%,#af98e4_100%)] text-[#1b1026] shadow-[0_18px_42px_rgba(70,50,201,0.3)] hover:-translate-y-[2px] hover:shadow-[0_24px_56px_rgba(70,50,201,0.38)] active:scale-[0.98]",
        outline:
          "border border-[rgba(249,246,250,0.16)] bg-[rgba(249,246,250,0.04)] text-foreground hover:bg-white/10",
        ghost: "bg-transparent text-muted-foreground hover:bg-white/10",
        secondary:
          "border border-[rgba(249,246,250,0.08)] bg-[rgba(249,246,250,0.06)] text-foreground hover:bg-white/10",
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
