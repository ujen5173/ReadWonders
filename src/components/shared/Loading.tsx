import { type HugeiconsProps, Loading03Icon } from "hugeicons-react";
import { cn } from "~/lib/utils";

export const Spinner = ({ className, ...props }: HugeiconsProps) => (
  <Loading03Icon
    className={cn("animate-spin text-gray-500", className)}
    {...props}
  />
);

export const LoadingScreen = () => {
  return (
    <div className="flex h-[calc(100vh-26rem)] w-full flex-col items-center justify-center">
      <Spinner className="h-10 w-10" />
    </div>
  );
};
