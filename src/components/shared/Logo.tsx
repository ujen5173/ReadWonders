import { merienda } from "~/config/font";
import { cn } from "~/lib/utils";

const Logo = ({ variant = "md" }: { variant?: "sm" | "md" }) => {
  return (
    <h1
      className={cn(
        merienda.className,
        `text-text-primary font-bold`,
        variant === "sm" ? "text-base sm:text-lg" : "text-xl sm:text-2xl",
      )}
    >
      <span className="text-primary">Read</span>
      <span>Wonders.</span>
    </h1>
  );
};

export default Logo;
