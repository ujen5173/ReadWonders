"use client";

import { CoinsDollarIcon } from "hugeicons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { cn } from "~/utils/cn";

const Navigation = () => {
  const pathname = usePathname();
  const { mutateAsync: createCheckoutSession } =
    api.stripe.createCheckoutSession.useMutation();

  const { push } = useRouter();

  const handleUpgrade = async () => {
    const { checkoutUrl } = await createCheckoutSession();

    if (checkoutUrl) {
      void push(checkoutUrl);
    }
  };

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-md bg-zinc-100 p-[5px]">
          <Link href="/settings/profile">
            <button
              className={cn(
                "rounded-md px-3 py-1 font-medium text-slate-600",
                pathname.includes("profile") || pathname === "/settings"
                  ? "border-border-80 border bg-white"
                  : "",
              )}
            >
              Profile
            </button>
          </Link>
          <Link href="/settings/notifications">
            <button
              className={cn(
                "rounded-md px-3 py-1 font-medium text-slate-600",
                pathname.includes("notifications")
                  ? "border-border-80 border bg-white"
                  : "",
              )}
            >
              Notifications
            </button>
          </Link>
          <Link href="/settings/danger">
            <button
              className={cn(
                "rounded-md px-3 py-1 font-medium text-slate-600",
                pathname.includes("danger")
                  ? "border-border-80 border bg-white"
                  : "",
              )}
            >
              Danger
            </button>
          </Link>
        </div>
        <Button onClick={handleUpgrade}>Try Premium</Button>
      </div>

      <Link href="/settings/coins">
        <Button variant="link" className="text-primary">
          <CoinsDollarIcon className="size-5" />
          Buy Coins
        </Button>
      </Link>
    </div>
  );
};

export default Navigation;
