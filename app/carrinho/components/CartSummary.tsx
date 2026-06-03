"use client";

import Link from "next/link";
import { Lock, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/app/utils/price";

type CartSummaryProps = {
  subtotal: number;
  totalItems: number;
};

const CartSummary = ({ subtotal, totalItems }: CartSummaryProps) => {
  const installment = subtotal / 12;

  const handleCoupon = () => {
    toast.info("Cupom aplicado em breve");
  };

  return (
    <aside className="flex flex-col !gap-7">
      <div className="rounded-xl border border-zinc-200 bg-white !p-5">
        <h2 className="font-[family-name:var(--font-bebas)] text-2xl text-zinc-950">
          RESUMO DO PEDIDO
        </h2>

        <div className="!mt-5 space-y-4 text-sm">
          <div className="flex items-center justify-between text-zinc-700">
            <span>Subtotal ({totalItems} produtos)</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <div className="flex items-center justify-between text-zinc-700">
            <span>Frete</span>
            <button className="font-medium text-zinc-950">Calcular</button>
          </div>
        </div>

        <div className="!my-5 h-px bg-zinc-200" />

        <div className="flex items-center justify-between">
          <span className="text-base font-bold">Total</span>
          <span className="text-2xl font-bold">{formatPrice(subtotal)}</span>
        </div>

        <p className="!mt-2 text-xs text-zinc-600">
          ou 12x de R$ {installment.toFixed(2).replace(".", ",")} sem juros
        </p>

        <div className="!mt-6 grid grid-cols-1 !gap-3">
          <Link
            href="/checkout"
            className="flex h-13 items-center justify-center !gap-3 rounded-lg bg-black !px-4 text-sm font-bold text-white transition-all duration-200 hover:bg-zinc-800"
          >
            <Lock size={18} />
            FINALIZAR COMPRA
          </Link>

          <Link
            href="/checkout"
            className="flex h-13 items-center justify-center !gap-3 rounded-lg border border-black bg-white !px-4 text-sm font-bold text-black transition-all duration-200 hover:bg-zinc-50"
          >
            <Zap size={18} />
            COMPRAR COM 1 CLIQUE
          </Link>
        </div>

        <div className="!mt-6 flex items-center justify-center !gap-3 text-center">
          <ShieldCheck size={24} />
          <div>
            <p className="text-xs font-bold">Ambiente 100% seguro</p>
            <span className="text-xs text-zinc-500">Seus dados protegidos</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white !p-5">
        <h2 className="text-sm font-bold">CUPOM DE DESCONTO</h2>

        <div className="!mt-4 flex">
          <input
            type="text"
            placeholder="Digite seu cupom"
            className="h-12 min-w-0 flex-1 rounded-l-md border border-zinc-200 bg-white !px-4 text-sm outline-none"
          />
          <button
            type="button"
            onClick={handleCoupon}
            className="h-12 rounded-r-md border border-l-0 border-zinc-200 !px-5 text-sm font-bold transition-all duration-200 hover:bg-zinc-50"
          >
            APLICAR
          </button>
        </div>
      </div>
    </aside>
  );
};

export default CartSummary;

