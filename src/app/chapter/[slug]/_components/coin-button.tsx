import { CoinsDollarIcon } from "hugeicons-react";
import * as React from "react";
import { Spinner } from "~/components/shared/Loading";
import { type ButtonProps, buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export interface CoinButtonProps extends ButtonProps {
  coins: number;
  loading?: boolean;
}
const CoinButton = React.forwardRef<HTMLButtonElement, CoinButtonProps>(
  ({ className, variant, size, children, loading, ...props }, ref) => {
    return (
      <button
        className={cn(
          "relative flex select-none items-center justify-center gap-2",
          buttonVariants({ variant, size, className }),
        )}
        data-loading={loading}
        ref={ref}
        {...props}
      >
        <div className="flex items-center gap-2 border-r border-border pr-2">
          <CoinsDollarIcon className="size-6" />
          <span className="">{props.coins}</span>
        </div>
        {loading && (
          <Spinner
            className={cn(
              variant === "default" || variant === undefined
                ? "text-slate-100"
                : "text-slate-600",
              "size-4",
            )}
          />
        )}
        {children}
      </button>
    );
  },
);

CoinButton.displayName = "CoinButton";

export { CoinButton };
