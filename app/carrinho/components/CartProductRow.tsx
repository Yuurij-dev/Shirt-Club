"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { useState } from "react";
import type { CartItem } from "@/app/context/CartContext";
import { useCart } from "@/app/context/CartContext";
import { useFavorites } from "@/app/context/FavoritesContext";
import { formatPrice, getPriceNumber } from "@/app/utils/price";
import QuantityControl from "./QuantityControl";

type CartProductRowProps = {
  item: CartItem;
};

const CartProductRow = ({ item }: CartProductRowProps) => {
  const { updateQuantity, removeItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [displayedImage, setDisplayedImage] = useState(item.product.image);
  const itemTotal = getPriceNumber(item.product.price) * item.quantity;
  const productHref = `/produtos/${item.product.id}`;

  const moveToFavorites = () => {
    if (!isFavorite(item.product.id)) {
      toggleFavorite(item.product);
    }

    removeItem(item.product.id, item.size);
  };

  return (
    <div className="grid grid-cols-1 !gap-5 border-b border-zinc-200 !p-4 last:border-b-0 md:grid-cols-[minmax(0,1.45fr)_120px_150px_120px_32px] md:items-center md:!p-5">
      <div className="flex !gap-4">
        <Link
          href={productHref}
          className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-zinc-100"
        >
          <Image
            src={displayedImage}
            alt={item.product.name}
            fill
            sizes="112px"
            onError={() => setDisplayedImage("/assets/bg.png")}
            className="object-cover"
          />
        </Link>

        <div className="min-w-0">
          <Link href={productHref}>
            <h2 className="text-sm font-bold text-zinc-950 transition-colors hover:text-zinc-600">
              {item.product.name}
            </h2>
          </Link>

          <p className="!mt-1 text-sm font-medium text-zinc-700">
            Torcedor {item.product.brand || item.product.team}
          </p>

          <div className="!mt-3 space-y-1 text-xs text-zinc-600">
            <p>Tamanho: {item.size}</p>
            <p>Personalização: {item.customization || "Sem personalização"}</p>
          </div>

          <button
            type="button"
            onClick={moveToFavorites}
            className="!mt-3 inline-flex h-9 items-center !gap-2 rounded-md border border-zinc-200 !px-3 text-xs font-bold transition-all duration-200 hover:border-black"
          >
            <Heart size={15} />
            MOVER PARA FAVORITOS
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between md:block">
        <span className="text-xs font-bold uppercase text-zinc-500 md:hidden">
          Preço
        </span>
        <span className="text-sm font-bold">{formatPrice(item.product.price)}</span>
      </div>

      <div className="flex items-center justify-between md:block md:text-center">
        <span className="text-xs font-bold uppercase text-zinc-500 md:hidden">
          Quantidade
        </span>
        <QuantityControl
          quantity={item.quantity}
          onDecrease={() =>
            updateQuantity(item.product.id, item.size, item.quantity - 1)
          }
          onIncrease={() =>
            updateQuantity(item.product.id, item.size, item.quantity + 1)
          }
        />
      </div>

      <div className="flex items-center justify-between md:block md:text-right">
        <span className="text-xs font-bold uppercase text-zinc-500 md:hidden">
          Total
        </span>
        <span className="text-sm font-bold">{formatPrice(itemTotal)}</span>
      </div>

      <button
        type="button"
        onClick={() => removeItem(item.product.id, item.size)}
        className="flex h-9 w-9 items-center justify-center justify-self-end rounded-md transition-all duration-200 hover:bg-zinc-100"
        aria-label={`Remover ${item.product.name}`}
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default CartProductRow;
