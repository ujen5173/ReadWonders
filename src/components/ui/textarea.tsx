import * as React from "react";

import { cn } from "~/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background",
          "placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };