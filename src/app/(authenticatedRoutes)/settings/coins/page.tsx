"use client";

import { CoinsDollarIcon } from "hugeicons-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

const BuyCoins = () => {
  const [coinsAmount, setCoinsAmount] = useState<number>(50);

  return (
    <div className="rounded-lg border border-border p-6 shadow-sm">
      <div className="mb-6">
        <h1 className={`scroll-m-20 text-3xl font-bold tracking-tight`}>
          Buy Coins
        </h1>
        <p className="text-base text-foreground">
          The more coins you buy, the cheaper they are
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
          <span>
            for{" "}
            <span className="font-semibold">
              ${Math.ceil(Number(coinsAmount) * 2.45)}
            </span>
          </span>
        </div>

        <Button variant={"default"}>Buy {coinsAmount} coins</Button>
      </div>
    </div>
  );
};

export default BuyCoins;
