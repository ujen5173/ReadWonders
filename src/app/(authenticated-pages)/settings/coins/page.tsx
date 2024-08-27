"use client";

import { stripeSubscriptionEnum } from "@prisma/client";
import { CoinsDollarIcon } from "hugeicons-react";
import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

const BuyCoins = () => {
  const { data, isLoading } = api.auth.getSubscriptionStatus.useQuery();

  const [coinsAmount, setCoinsAmount] = useState<number>(50);

  const { originalPrice, discountedPrice, discount } = useMemo(() => {
    const basePrice = 0.25;
    const discountStartAmount = 100; // Discount starts at 100 coins
    const maxDiscount = 0.3; // Maximum 30% discount
    const discountRate = 0.0012; // Discount increases by 0.02% per coin after discountStartAmount
    const subscriptionDiscount = 0.2; // 20% discount for subscribers

    let discountPercentage = 0;

    if (coinsAmount > discountStartAmount) {
      discountPercentage = Math.min(
        (coinsAmount - discountStartAmount) * discountRate,
        maxDiscount,
      );
    }

    // Apply subscription discount if user has a paid subscription
    if (data === stripeSubscriptionEnum.active) {
      discountPercentage = Math.max(discountPercentage, subscriptionDiscount);
    }

    const originalTotal = Math.ceil(coinsAmount * basePrice);
    const discountedTotal = Math.ceil(
      coinsAmount * basePrice * (1 - discountPercentage),
    );

    return {
      originalPrice: originalTotal,
      discountedPrice: discountedTotal,
      discount: discountPercentage * 100, // Convert to percentage for display
    };
  }, [coinsAmount, data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rounded-lg border border-border p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="mb-2 scroll-m-20 text-3xl font-bold tracking-tight">
          Buy Coins
        </h1>
        <p className="text-base text-foreground">
          The more coins you purchase, the more you save!. Support our community
          of storytellers.
        </p>
      </div>

      <div className="">
        <h1 className="mb-4 text-lg font-semibold">Select the coins amount</h1>
        <div className="mb-6 flex items-center gap-4">
          <CoinsDollarIcon className="size-8 text-primary" />
          <Input
            value={coinsAmount}
            onChange={(e) => {
              const value = e.target.value;

              if (/^\d*$/.test(value)) {
                setCoinsAmount(Number(value));
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "." || e.key === "e" || e.key === "-") {
                e.preventDefault();
              }
            }}
            defaultValue={50}
            className="w-32"
            min="20"
            placeholder="825"
            type="number"
            step={5}
          />
          <span className="flex gap-2 text-base">
            <span className={discount > 0 ? "text-gray-500 line-through" : ""}>
              ${originalPrice}
            </span>
            {discount > 0 && (
              <span className="font-semibold text-green-600">
                ${discountedPrice}
              </span>
            )}
            {data === stripeSubscriptionEnum.active && (
              <span className="text-green-600">
                (20% off as a premium user)
              </span>
            )}
          </span>
        </div>

        <Button variant="default">Buy {coinsAmount} coins</Button>
      </div>
    </div>
  );
};

export default BuyCoins;
