"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/app/data/products";
import { useFavorites } from "@/app/context/FavoritesContext";

type ProductGalleryProps = {
  product: Product;
};

const ProductGallery = ({ product }: ProductGalleryProps) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [displayedImage, setDisplayedImage] = useState(product.images[0]);
  const active = isFavorite(product.id);

  return (
    <div className="grid grid-cols-1 !gap-4 md:grid-cols-[92px_1fr]">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100 md:order-2">
        <button
          type="button"
          aria-label={
            active
              ? `Remover ${product.name} dos favoritos`
              : `Adicionar ${product.name} aos favoritos`
          }
          onClick={() => toggleFavorite(product)}
          className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm transition-all duration-200 hover:scale-105"
        >
          <Heart
            size={23}
            className={`transition-all duration-200 ${
              active ? "fill-red-500 text-red-500" : "text-zinc-800"
            }`}
          />
        </button>

        <Image
          src={displayedImage}
          alt={product.name}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          onError={() => setDisplayedImage("/assets/bg.png")}
          className="object-cover"
        />
      </div>

      <div className="flex justify-center !gap-3 overflow-x-auto md:order-1 md:flex-col md:justify-start md:overflow-visible">
        {product.images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => {
              setSelectedIndex(index);
              setDisplayedImage(image);
            }}
            className={`
              relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-zinc-100
              sm:h-24 sm:w-24 md:w-full
              ${selectedIndex === index ? "border-black" : "border-zinc-200"}
            `}
          >
            <Image
              src={image}
              alt={`${product.name} foto ${index + 1}`}
              fill
              sizes="92px"
              onError={() => setDisplayedImage("/assets/bg.png")}
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
