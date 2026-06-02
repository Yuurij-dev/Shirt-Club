"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { useState } from "react";
import { type Product, useFavorites } from "@/app/context/FavoritesContext";

type ProductCardProps = {
  product: Product;
  variant?: "grid" | "carousel";
  showFavorite?: boolean;
};

const ProductCard = ({
  product,
  variant = "grid",
  showFavorite = true,
}: ProductCardProps) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [displayedImage, setDisplayedImage] = useState(product.image);

  const active = isFavorite(product.name);
  const isCarousel = variant === "carousel";

  return (
    <div
      className={`
        ${isCarousel ? "min-w-[190px] sm:min-w-[210px]" : ""}
        overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl
      `}
    >
      <div
        className={`
          relative overflow-hidden rounded-2xl bg-zinc-100
          ${isCarousel ? "h-[230px] sm:h-[260px]" : "h-[320px] sm:h-[360px]"}
        `}
      >
        {showFavorite && (
          <button
            onClick={() => toggleFavorite(product)}
            aria-label={
              active
                ? `Remover ${product.name} dos favoritos`
                : `Adicionar ${product.name} aos favoritos`
            }
            className="
              absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center
              rounded-full bg-white shadow-sm transition-all duration-200
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
        )}

        <Image
          src={displayedImage}
          alt={product.name}
          fill
          sizes={
            isCarousel
              ? "(min-width: 640px) 210px, 190px"
              : "(min-width: 1280px) 20vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          }
          onError={() => setDisplayedImage("/assets/bg.png")}
          className="
            object-cover
            transition-all
            duration-500
            hover:scale-105
          "
        />
      </div>

      <div className="!p-4">
        <h3 className="text-sm font-medium text-zinc-800 sm:text-base">
          {product.name}
        </h3>

        <p
          className={`
            !mt-2 font-bold text-zinc-950
            ${isCarousel ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"}
          `}
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
