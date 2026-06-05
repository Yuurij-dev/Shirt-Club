"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import CheckoutOrderSummary from "./CheckoutOrderSummary";
import CustomerDataForm from "./CustomerDataForm";

const CheckoutContent = () => {
  const { items, subtotal, discount, total, totalItems, appliedCoupon } = useCart();

  if (items.length === 0) {
    return (
      <section className="rounded-xl border border-zinc-200 bg-white !p-10 text-center">
        <ShoppingCart className="mx-auto !mb-4 text-zinc-400" size={44} />
        <h1 className="font-[family-name:var(--font-bebas)] text-4xl text-zinc-950">
          CARRINHO VAZIO
        </h1>
        <p className="!mt-2 text-sm text-zinc-500">
          Adicione produtos ao carrinho antes de preencher o checkout.
        </p>
        <Link
          href="/lancamentos"
          className="!mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-black !px-6 text-sm font-bold text-white transition-all duration-200 hover:bg-zinc-800"
        >
          VER PRODUTOS
        </Link>
      </section>
    );
  }

  return (
    <>
      <div className="flex flex-col !gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-bebas)] text-5xl text-zinc-950">
            CHECKOUT
          </h1>
          <p className="!mt-1 text-sm text-zinc-600">
            Preencha seus dados para preparar o pedido.
          </p>
        </div>

        <Link
          href="/carrinho"
          className="inline-flex items-center !gap-2 text-sm font-bold transition-all duration-200 hover:text-zinc-600"
        >
          <ArrowLeft size={18} />
          VOLTAR AO CARRINHO
        </Link>
      </div>

      <section className="!mt-6 grid grid-cols-1 !gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <CustomerDataForm
          items={items}
          discount={discount}
          total={total}
          couponCode={appliedCoupon?.coupon.code || null}
        />
        <CheckoutOrderSummary
          items={items}
          subtotal={subtotal}
          discount={discount}
          total={total}
          couponCode={appliedCoupon?.coupon.code || null}
          totalItems={totalItems}
        />
      </section>
    </>
  );
};

export default CheckoutContent;
