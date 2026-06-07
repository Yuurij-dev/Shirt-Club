"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Tag, X } from "lucide-react";
import { useCart } from "@/app/context/CartContext";

const CartCouponCard = () => {
  const { appliedCoupon, applyCoupon, removeCoupon } = useCart();
  const [couponCode, setCouponCode] = useState(appliedCoupon?.coupon.code || "");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponFeedback, setCouponFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const hasCouponError = couponFeedback?.type === "error";

  const handleCoupon = async () => {
    setIsApplyingCoupon(true);
    setCouponFeedback(null);

    try {
      const result = await applyCoupon(couponCode);

      setCouponFeedback({
        type: result.applied ? "success" : "error",
        message:
          result.message ||
          (result.applied ? "Cupom aplicado com sucesso" : "Cupom inv\u00e1lido"),
      });

      if (result.applied) {
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
          onChange={(event) => {
            setCouponCode(event.target.value.toUpperCase());
            setCouponFeedback(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void handleCoupon();
            }
          }}
          placeholder="Digite seu cupom"
          aria-invalid={hasCouponError}
          className={`h-12 min-w-0 flex-1 rounded-l-md border bg-white !px-4 text-sm font-bold outline-none transition-colors ${
            hasCouponError
              ? "border-red-500 text-red-700 placeholder:text-red-300"
              : "border-zinc-200"
          }`}
        />
        <button
          type="button"
          onClick={handleCoupon}
          disabled={isApplyingCoupon}
          className={`h-12 cursor-pointer rounded-r-md border border-l-0 !px-5 text-sm font-bold transition-all duration-200 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 ${
            hasCouponError ? "border-red-500 text-red-700" : "border-zinc-200"
          }`}
        >
          {isApplyingCoupon ? "..." : "APLICAR"}
        </button>
      </div>

      {couponFeedback && (
        <div
          className={`!mt-3 flex items-start !gap-2 rounded-lg !p-3 text-sm font-medium ${
            couponFeedback.type === "error"
              ? "bg-red-50 text-red-700"
              : "bg-emerald-50 text-emerald-800"
          }`}
        >
          {couponFeedback.type === "error" ? (
            <AlertCircle className="mt-0.5 shrink-0" size={16} />
          ) : (
            <CheckCircle2 className="mt-0.5 shrink-0" size={16} />
          )}
          <span>{couponFeedback.message}</span>
        </div>
      )}

      {appliedCoupon && (
        <div className="!mt-4 flex items-center justify-between rounded-lg bg-emerald-50 !p-3 text-sm text-emerald-800">
          <span className="inline-flex items-center !gap-2 font-bold">
            <Tag size={16} />
            {appliedCoupon.coupon.code}
          </span>
          <button
            type="button"
            onClick={() => {
              removeCoupon();
              setCouponFeedback(null);
            }}
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
