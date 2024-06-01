import { type LucideProps } from "lucide-react";
import { cn } from "~/utils/cn";
import { Icons } from "../Icons/Icons";

export const Spinner = ({ className, ...props }: LucideProps) => (
  <Icons.spinner
    className={cn("animate-spin text-gray-500", className)}
    {...props}
  />
);

export const LoadingScreen = () => {
  return (
    <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center">
      <Spinner className="h-10 w-10 " />
    </div>
  );
};
