"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { Product, useFavorites } from "@/app/context/FavoritesContext";

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const { toggleFavorite, isFavorite } = useFavorites();

  const active = isFavorite(product.name);

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      <div
        className="
          relative
          h-[320px]
          overflow-hidden
          rounded-2xl
          bg-zinc-100

          sm:h-[360px]
        "
      >
        <button
          onClick={() => toggleFavorite(product)}
          className="
            absolute
            right-4
            top-4
            z-10
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-white
            shadow-sm
            transition-all
            duration-200
            hover:scale-110
          "
        >
          <Heart
            size={20}
            className={`transition-all duration-200 ${
              active ? "fill-red-500 text-red-500" : "text-zinc-700"
            }`}
          />
        </button>

        <Image
          src={product.image}
          alt={product.name}
          fill
          className="
            object-cover
            transition-all
            duration-500
            hover:scale-105
          "
        />
      </div>

      <div className="!p-4">
        <h3
          className="
            text-sm
            font-medium
            text-zinc-800

            sm:text-base
          "
        >
          {product.name}
        </h3>

        <p
          className="
            !mt-2
            text-xl
            font-bold
            text-zinc-950

            sm:text-2xl
          "
        >
          {typeof product.price === "number"
            ? `R$ ${product.price.toFixed(2).replace(".", ",")}`
            : product.price}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;