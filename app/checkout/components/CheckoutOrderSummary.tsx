"use client";

import Image from "next/image";
import { PackageCheck, ShieldCheck } from "lucide-react";
import type { CartItem } from "@/app/context/CartContext";
import { formatPrice, getPriceNumber } from "@/app/utils/price";

type CheckoutOrderSummaryProps = {
  items: CartItem[];
  subtotal: number;
  totalItems: number;
};

const CheckoutOrderSummary = ({
  items,
  subtotal,
  totalItems,
}: CheckoutOrderSummaryProps) => {
  const installment = subtotal / 12;

  return (
    <aside className="lg:sticky lg:top-6">
      <div className="rounded-xl border border-zinc-200 bg-white !p-5">
        <div className="flex items-center !gap-3">
          <PackageCheck size={22} />
          <h2 className="font-[family-name:var(--font-bebas)] text-3xl leading-none text-zinc-950">
            SEU PEDIDO
          </h2>
        </div>

        <div className="!mt-5 flex flex-col !gap-4">
          {items.map((item) => {
            const itemTotal = getPriceNumber(item.product.price) * item.quantity;

            return (
              <div
                key={`${item.product.id}-${item.size}`}
                className="flex !gap-3 border-b border-zinc-100 !pb-4 last:border-b-0 last:!pb-0"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-sm font-bold text-zinc-950">
                    {item.product.name}
                  </h3>
                  <p className="!mt-1 text-xs text-zinc-500">
                    Tam: {item.size} | Qtd: {item.quantity}
                  </p>
                  <p className="!mt-1 text-xs text-zinc-500">
                    {item.customization || "Sem personalizacao"}
                  </p>
                  <p className="!mt-2 text-sm font-bold">
                    {formatPrice(itemTotal)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="!my-5 h-px bg-zinc-200" />

        <div className="flex items-center justify-between text-sm text-zinc-700">
          <span>Subtotal ({totalItems} produtos)</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className="!mt-3 flex items-center justify-between text-sm text-zinc-700">
          <span>Frete</span>
          <span>Calculado depois</span>
        </div>

        <div className="!my-5 h-px bg-zinc-200" />

        <div className="flex items-center justify-between">
          <span className="font-bold">Total</span>
          <span className="text-2xl font-bold">{formatPrice(subtotal)}</span>
        </div>

        <p className="!mt-2 text-xs text-zinc-600">
          ou 12x de R$ {installment.toFixed(2).replace(".", ",")} sem juros
        </p>

        <div className="!mt-6 flex items-center justify-center !gap-3 rounded-lg bg-zinc-50 !p-4 text-center">
          <ShieldCheck size={24} />
          <div>
            <p className="text-xs font-bold">Checkout seguro</p>
            <span className="text-xs text-zinc-500">
              Pedido preparado para Mercado Pago
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default CheckoutOrderSummary;
