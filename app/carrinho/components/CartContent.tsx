"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import CartCouponCard from "./CartCouponCard";
import CartProductRow from "./CartProductRow";
import CartRecommendations from "./CartRecommendations";
import CartSummary from "./CartSummary";
import FreeShippingProgress from "./FreeShippingProgress";

const CartContent = () => {
  const { items, subtotal, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <>
        <section className="rounded-xl border border-zinc-200 bg-white !p-10 text-center">
          <ShoppingCart className="mx-auto !mb-4 text-zinc-400" size={44} />
          <h1 className="font-[family-name:var(--font-bebas)] text-4xl text-zinc-950">
            CARRINHO VAZIO
          </h1>
          <p className="!mt-2 text-sm text-zinc-500">
            Adicione produtos ao carrinho para finalizar sua compra.
          </p>
          <Link
            href="/masculino"
            className="!mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-black !px-6 text-sm font-bold text-white transition-all duration-200 hover:bg-zinc-800"
          >
            CONTINUAR COMPRANDO
          </Link>
        </section>

        <CartRecommendations />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col !gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-bebas)] text-5xl text-zinc-950">
            CARRINHO
          </h1>
          <p className="!mt-1 text-sm text-zinc-600">
            {totalItems} {totalItems === 1 ? "produto" : "produtos"}
          </p>
        </div>

        <Link
          href="/masculino"
          className="inline-flex items-center !gap-2 text-sm font-bold transition-all duration-200 hover:text-zinc-600"
        >
          <ArrowLeft size={18} />
          CONTINUAR COMPRANDO
        </Link>
      </div>

      <section className="!mt-6 grid grid-cols-1 !gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col !gap-7">
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <div className="hidden grid-cols-[minmax(0,1.45fr)_120px_150px_120px_32px] border-b border-zinc-200 !px-5 !py-4 text-xs font-bold uppercase text-zinc-950 md:grid">
              <span>Produto</span>
              <span>Preço</span>
              <span className="text-center">Quantidade</span>
              <span className="text-right">Total</span>
              <span />
            </div>

            {items.map((item) => (
              <CartProductRow
                key={`${item.product.id}-${item.size}`}
                item={item}
              />
            ))}
          </div>

          <FreeShippingProgress subtotal={subtotal} />
          <CartCouponCard />
        </div>

        <CartSummary subtotal={subtotal} totalItems={totalItems} />
      </section>

      <CartRecommendations />
    </>
  );
};

export default CartContent;
