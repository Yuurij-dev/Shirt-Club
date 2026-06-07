"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import type { Product } from "@/app/data/products";
import type { Coupon } from "@/app/data/coupons";
import { getPriceNumber } from "@/app/utils/price";

export type CartItem = {
  product: Product;
  quantity: number;
  size: string;
  customization?: string;
};

type AddItemInput = {
  product: Product;
  quantity?: number;
  size?: string;
  customization?: string;
  silent?: boolean;
};

type CartContextType = {
  items: CartItem[];
  appliedCoupon: AppliedCoupon | null;
  totalItems: number;
  subtotal: number;
  discount: number;
  total: number;
  addItem: (item: AddItemInput) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  applyCoupon: (code: string) => Promise<CouponApplyResult>;
  removeCoupon: () => void;
  clearCart: () => void;
};

const CartContext = createContext({} as CartContextType);

const storageKey = "@shirtclub:cart";
const couponStorageKey = "@shirtclub:coupon";

type AppliedCoupon = {
  coupon: Coupon;
  discount: number;
  total: number;
};

export type CouponApplyResult = {
  applied: boolean;
  message?: string;
};

type CouponValidationResponse = {
  valid: boolean;
  coupon?: Coupon;
  discount?: number;
  total?: number;
  error?: string;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [hasLoadedCart, setHasLoadedCart] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const savedCart = localStorage.getItem(storageKey);

      if (!savedCart) {
        setHasLoadedCart(true);
        return;
      }

      try {
        const parsedCart = JSON.parse(savedCart) as CartItem[];

        setItems(
          parsedCart.filter(
            (item) => Boolean(item.product?.id) && item.quantity > 0
          )
        );
      } catch {
        setItems([]);
      } finally {
        const savedCoupon = localStorage.getItem(couponStorageKey);

        if (savedCoupon) {
          try {
            setAppliedCoupon(JSON.parse(savedCoupon) as AppliedCoupon);
          } catch {
            localStorage.removeItem(couponStorageKey);
          }
        }

        setHasLoadedCart(true);
      }
    }, 0);
  }, []);

  useEffect(() => {
    if (!hasLoadedCart) return;

    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [hasLoadedCart, items]);

  useEffect(() => {
    if (!hasLoadedCart) return;

    if (!appliedCoupon) {
      localStorage.removeItem(couponStorageKey);
      return;
    }

    localStorage.setItem(couponStorageKey, JSON.stringify(appliedCoupon));
  }, [appliedCoupon, hasLoadedCart]);

  const addItem = ({
    product,
    quantity = 1,
    size = "M",
    customization = "Sem personalização",
    silent = false,
  }: AddItemInput) => {
    setItems((currentItems) => {
      const itemAlreadyInCart = currentItems.some(
        (item) => item.product.id === product.id && item.size === size
      );

      if (!itemAlreadyInCart) {
        return [
          ...currentItems,
          {
            product,
            quantity,
            size,
            customization,
          },
        ];
      }

      return currentItems.map((item) => {
        if (item.product.id !== product.id || item.size !== size) {
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + quantity,
          customization,
        };
      });
    });

    if (!silent) {
      toast.success("Produto adicionado ao carrinho");
    }
  };

  const removeItem = (productId: string, size: string) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.product.id !== productId || item.size !== size
      )
    );

    toast.info("Produto removido do carrinho");
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, size);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.product.id !== productId || item.size !== size) {
          return item;
        }

        return {
          ...item,
          quantity,
        };
      })
    );
  };

  const clearCart = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(couponStorageKey);
    }

    setItems([]);
    setAppliedCoupon(null);
  };

  const totalItems = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) => total + getPriceNumber(item.product.price) * item.quantity,
      0
    );
  }, [items]);

  const discount = appliedCoupon?.discount || 0;
  const total = Math.max(0, subtotal - discount);
  const appliedCouponCode = appliedCoupon?.coupon.code;

  useEffect(() => {
    if (!hasLoadedCart || !appliedCouponCode) return;

    let shouldIgnore = false;

    const refreshCoupon = async () => {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: appliedCouponCode,
          subtotal,
        }),
      });
      const result = (await response.json()) as CouponValidationResponse;

      if (shouldIgnore) return;

      if (!response.ok || !result.valid || !result.coupon) {
        setAppliedCoupon(null);
        return;
      }

      setAppliedCoupon({
        coupon: result.coupon,
        discount: result.discount || 0,
        total: result.total || Math.max(0, subtotal - (result.discount || 0)),
      });
    };

    void refreshCoupon();

    return () => {
      shouldIgnore = true;
    };
  }, [appliedCouponCode, hasLoadedCart, subtotal]);

  const applyCoupon = async (code: string) => {
    const response = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        subtotal,
      }),
    });

    const result = (await response.json()) as CouponValidationResponse;

    if (!response.ok || !result.valid || !result.coupon) {
      return {
        applied: false,
        message: result.error || "Cupom inv\u00e1lido",
      };
    }

    setAppliedCoupon({
      coupon: result.coupon,
      discount: result.discount || 0,
      total: result.total || Math.max(0, subtotal - (result.discount || 0)),
    });

    return {
      applied: true,
      message: "Cupom aplicado com sucesso",
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        appliedCoupon,
        totalItems,
        subtotal,
        discount,
        total,
        addItem,
        removeItem,
        updateQuantity,
        applyCoupon,
        removeCoupon,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
