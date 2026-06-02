"use client";

import {
  CreditCard,
  Ruler,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/app/data/products";
import { useCart } from "@/app/context/CartContext";
import { formatPrice, getPriceNumber } from "@/app/utils/price";

type ProductBuyBoxProps = {
  product: Product;
};

const sizes = ["P", "M", "G", "GG", "XG"];

const ProductBuyBox = ({ product }: ProductBuyBoxProps) => {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const price = getPriceNumber(product.price);
  const installment = price / 12;

  const handleAddToCart = () => {
    addItem({
      product,
      quantity,
      size: selectedSize,
    });
  };

  const handleBuyNow = () => {
    addItem({
      product,
      quantity,
      size: selectedSize,
    });

    toast.success("Compra iniciada");
  };

  return (
    <div>
      {product.badge && (
        <span className="inline-flex rounded-md bg-black !px-3 !py-1 text-xs font-bold text-white">
          {product.badge}
        </span>
      )}

      <h1 className="!mt-3 text-3xl font-bold text-zinc-950 sm:text-4xl">
        {product.name}
      </h1>

      <div className="!mt-3 flex flex-wrap items-center !gap-2 text-sm text-zinc-600">
        <span>{product.team}</span>
        {product.brand && <span>• {product.brand}</span>}
        {product.season && <span>• {product.season}</span>}
      </div>

      <p className="!mt-5 text-3xl font-bold text-zinc-950">
        {formatPrice(product.price)}
      </p>

      <p className="!mt-1 text-sm text-zinc-600">
        ou 12x de R$ {installment.toFixed(2).replace(".", ",")} sem juros
      </p>

      <p className="!mt-6 max-w-[620px] text-sm leading-7 text-zinc-700">
        {product.description}
      </p>

      <div className="!my-7 h-px w-full bg-zinc-200" />

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase text-zinc-950">
            Tamanho
          </h2>

          <button className="flex items-center !gap-2 text-xs font-medium text-zinc-700">
            <Ruler size={14} />
            Guia de tamanhos
          </button>
        </div>

        <div className="!mt-3 flex flex-wrap !gap-3">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              className={`
                h-11 min-w-14 rounded-md border !px-4 text-sm font-bold transition-all duration-200
                ${
                  selectedSize === size
                    ? "border-black bg-black text-white"
                    : "border-zinc-200 bg-white text-zinc-950 hover:border-black"
                }
              `}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="!mt-6">
        <h2 className="text-xs font-bold uppercase text-zinc-950">
          Quantidade
        </h2>

        <div className="!mt-3 inline-flex h-11 items-center rounded-md border border-zinc-200">
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            className="h-full w-11 text-xl"
          >
            -
          </button>
          <span className="w-10 text-center text-sm font-bold">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((current) => current + 1)}
            className="h-full w-11 text-xl"
          >
            +
          </button>
        </div>
      </div>

      <div className="!mt-7 grid grid-cols-1 !gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex h-14 items-center justify-center !gap-3 rounded-lg bg-black !px-5 text-sm font-bold text-white transition-all duration-200 hover:bg-zinc-800"
        >
          <ShoppingCart size={20} />
          ADICIONAR AO CARRINHO
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          className="flex h-14 items-center justify-center !gap-3 rounded-lg border border-black bg-white !px-5 text-sm font-bold text-black transition-all duration-200 hover:bg-zinc-50"
        >
          <Zap size={20} />
          COMPRAR AGORA
        </button>
      </div>

      <div className="!mt-7 grid grid-cols-1 !gap-4 border-t border-zinc-200 !pt-6 sm:grid-cols-3">
        <div className="flex items-center justify-center !gap-3 text-center sm:justify-start sm:text-left">
          <ShieldCheck size={24} />
          <div>
            <p className="text-xs font-bold">COMPRA SEGURA</p>
            <span className="text-xs text-zinc-500">Seus dados protegidos</span>
          </div>
        </div>

        <div className="flex items-center justify-center !gap-3 text-center sm:justify-start sm:text-left">
          <Truck size={26} />
          <div>
            <p className="text-xs font-bold">ENVIO RÁPIDO</p>
            <span className="text-xs text-zinc-500">Postagem em até 24h</span>
          </div>
        </div>

        <div className="flex items-center justify-center !gap-3 text-center sm:justify-start sm:text-left">
          <CreditCard size={25} />
          <div>
            <p className="text-xs font-bold">12X SEM JUROS</p>
            <span className="text-xs text-zinc-500">Parcele com facilidade</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductBuyBox;
