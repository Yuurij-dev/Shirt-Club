"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { Product } from "@/app/context/FavoritesContext";
import ProductCard from "./productCard";

type ProductCarouselProps = {
  title: string;
  products: Product[];
  showViewAll?: boolean;
};

const CARD_SCROLL_WIDTH = 230;

const ProductCarousel = ({
  title,
  products,
  showViewAll = true,
}: ProductCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselProducts = [...products, ...products];

  const scrollRight = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const maxScroll = carousel.scrollWidth - carousel.clientWidth;

    if (carousel.scrollLeft + CARD_SCROLL_WIDTH >= maxScroll) {
      carousel.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      carousel.scrollBy({ left: CARD_SCROLL_WIDTH, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const maxScroll = carousel.scrollWidth - carousel.clientWidth;

    if (carousel.scrollLeft <= 0) {
      carousel.scrollTo({ left: maxScroll, behavior: "smooth" });
    } else {
      carousel.scrollBy({ left: -CARD_SCROLL_WIDTH, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="!mb-5 flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-bebas)] text-3xl text-zinc-950 sm:text-4xl">
          {title}
        </h2>

        {showViewAll && (
          <a
            href="#"
            className="text-xs font-medium text-zinc-700 hover:underline sm:text-sm"
          >
            Ver todos &rsaquo;
          </a>
        )}
      </div>

      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute -left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-all duration-200 hover:scale-110 sm:h-9 sm:w-9"
        >
          <ChevronLeft size={20} />
        </button>

        <div ref={carouselRef} className="flex gap-4 overflow-x-hidden scroll-smooth">
          {carouselProducts.map((product, index) => (
            <ProductCard
              key={`${product.name}-${index}`}
              product={product}
              variant="carousel"
            />
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute -right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-all duration-200 hover:scale-110 sm:h-9 sm:w-9"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ProductCarousel;
