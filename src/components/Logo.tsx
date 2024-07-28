import { merienda } from "~/config/font";
import { cn } from "~/utils/cn";

const Logo = ({ variant = "md" }: { variant?: "sm" | "md" }) => {
  return (
    <h1
      className={cn(
        merienda.className,
        `font-bold text-text-primary`,
        variant === "sm" ? "text-base sm:text-lg" : "text-xl sm:text-2xl",
      )}
    >
      <span className="text-primary">Read</span>
      <span>Wonders.</span>
    </h1>
  );
};

export default Logo;
