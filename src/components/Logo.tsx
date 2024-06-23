import { suezOne } from "~/config/font";
import { cn } from "~/utils/cn";

const Logo = ({ variant = "md" }: { variant?: "sm" | "md" }) => {
  return (
    <h1
      className={cn(
        suezOne.className,
        `font-bold text-text-primary`,
        variant === "sm" ? "text-lg" : "text-2xl",
      )}
    >
      <span className="text-primary">Read</span>
      <span>Wonders.</span>
    </h1>
  );
};

export default Logo;
