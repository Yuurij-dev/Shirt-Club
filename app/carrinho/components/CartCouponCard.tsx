"use client";

import { useState } from "react";
import { Tag, X } from "lucide-react";
import { useCart } from "@/app/context/CartContext";

const CartCouponCard = () => {
  const { appliedCoupon, applyCoupon, removeCoupon } = useCart();
  const [couponCode, setCouponCode] = useState(appliedCoupon?.coupon.code || "");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleCoupon = async () => {
    setIsApplyingCoupon(true);

    try {
      const wasApplied = await applyCoupon(couponCode);

      if (wasApplied) {
        setCouponCode("");
      }
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white !p-5">
      <h2 className="text-sm font-bold">CUPOM DE DESCONTO</h2>

      <div className="!mt-4 flex">
        <input
          type="text"
          value={couponCode}
          onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
          placeholder="Digite seu cupom"
          className="h-12 min-w-0 flex-1 rounded-l-md border border-zinc-200 bg-white !px-4 text-sm font-bold outline-none"
        />
        <button
          type="button"
          onClick={handleCoupon}
          disabled={isApplyingCoupon}
          className="h-12 cursor-pointer rounded-r-md border border-l-0 border-zinc-200 !px-5 text-sm font-bold transition-all duration-200 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isApplyingCoupon ? "..." : "APLICAR"}
        </button>
      </div>

      {appliedCoupon && (
        <div className="!mt-4 flex items-center justify-between rounded-lg bg-emerald-50 !p-3 text-sm text-emerald-800">
          <span className="inline-flex items-center !gap-2 font-bold">
            <Tag size={16} />
            {appliedCoupon.coupon.code}
          </span>
          <button
            type="button"
            onClick={removeCoupon}
            className="inline-flex cursor-pointer items-center !gap-1 text-xs font-bold"
          >
            <X size={14} />
            REMOVER
          </button>
        </div>
      )}
    </div>
  );
};

export default CartCouponCard;
