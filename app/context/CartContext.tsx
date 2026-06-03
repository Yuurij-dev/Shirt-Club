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
  totalItems: number;
  subtotal: number;
  addItem: (item: AddItemInput) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext({} as CartContextType);

const storageKey = "@shirtclub:cart";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
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
        setHasLoadedCart(true);
      }
    }, 0);
  }, []);

  useEffect(() => {
    if (!hasLoadedCart) return;

    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [hasLoadedCart, items]);

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
    setItems([]);
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

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
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
