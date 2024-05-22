import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "~/utils/cn";
import { Spinner } from "../Loading";

const buttonVariants = cva(
  "ring-none inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-primary hover:shadow-md hover:-translate-y-[0.5px] transition shadow-secondary text-primary-foreground hover:bg-primary-hover",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input hover:bg-accent text-text-primary hover:bg-background transition hover:shadow-md hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground transition hover:shadow-md",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        "ghost-link":
          "text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20",
        link: "underline-offset-4 hover:underline text-text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        icon: "size-9 rounded-md",
        lg: "h-11 px-8 rounded-md",
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
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, loading, ...props }, ref) => {
    return (
      <button
        className={cn(
          "relative flex select-none items-center justify-center",
          buttonVariants({ variant, size, className }),
        )}
        data-loading={loading}
        ref={ref}
        {...props}
      >
        {loading && <Spinner className="absolute text-primary" />}
        {loading ? <span className="opacity-0"> {children}</span> : children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
