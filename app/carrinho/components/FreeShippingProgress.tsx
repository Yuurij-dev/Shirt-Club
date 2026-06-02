"use client";

import { Truck } from "lucide-react";
import { formatPrice } from "@/app/utils/price";

type FreeShippingProgressProps = {
  subtotal: number;
};

const freeShippingGoal = 299;

const FreeShippingProgress = ({ subtotal }: FreeShippingProgressProps) => {
  const remaining = Math.max(0, freeShippingGoal - subtotal);
  const progress = Math.min(100, (subtotal / freeShippingGoal) * 100);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white !p-5">
      <div className="flex flex-col !gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center !gap-4">
          <Truck size={34} />
          <div>
            <p className="text-sm font-bold">FRETE GRÁTIS</p>
            <span className="text-xs text-zinc-600">
              {remaining > 0
                ? `Adicione mais ${formatPrice(remaining)} para ganhar frete grátis`
                : "Você ganhou frete grátis para todo Brasil!"}
            </span>
          </div>
        </div>

        <div className="flex-1">
          <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
            <div
              className="h-full rounded-full bg-black transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {remaining > 0 && (
          <div className="text-sm font-bold sm:text-right">
            <span className="block text-xs text-zinc-500">Faltam</span>
            {formatPrice(remaining)}
          </div>
        )}
      </div>
    </div>
  );
};

export default FreeShippingProgress;
