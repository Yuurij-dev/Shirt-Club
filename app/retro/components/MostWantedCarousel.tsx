"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

type Product = {
  name: string;
  price: string;
  image: string;
};

const products: Product[] = [
  {
    name: "Brasil Retrô 1994",
    price: "R$ 239,90",
    image: "/products/retro/brasil-1994.png",
  },
  {
    name: "Milan Retrô 2007",
    price: "R$ 229,90",
    image: "/products/retro/milan-2007.png",
  },
  {
    name: "Barcelona Retrô 2015",
    price: "R$ 229,90",
    image: "/products/retro/barcelona-2015.png",
  },
  {
    name: "Flamengo Retrô 1981",
    price: "R$ 219,90",
    image: "/products/retro/flamengo-1981.png",
  },
  {
    name: "Vasco Retrô 1998",
    price: "R$ 209,90",
    image: "/products/retro/vasco-1998.png",
  },
  {
    name: "Inter Retrô 1998",
    price: "R$ 209,90",
    image: "/products/retro/inter-1998.png",
  },
];

const MostWantedCarousel = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselProducts = [...products, ...products];

  const scrollRight = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const cardWidth = 230;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;

    if (carousel.scrollLeft + cardWidth >= maxScroll) {
      carousel.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      carousel.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const cardWidth = 230;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;

    if (carousel.scrollLeft <= 0) {
      carousel.scrollTo({ left: maxScroll, behavior: "smooth" });
    } else {
      carousel.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-white !px-4 !py-8 sm:!px-6 lg:!px-0">
      <div className="container !mx-auto">
        <h2 className="font-[family-name:var(--font-bebas)] text-3xl text-zinc-950 sm:text-4xl">
          MAIS PROCURADAS
        </h2>

        <div className="relative !mt-5">
          <button
            onClick={scrollLeft}
            className="absolute -left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft size={20} />
          </button>

          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-hidden scroll-smooth"
          >
            {carouselProducts.map((product, index) => (
              <a
                href="#"
                key={`${product.name}-${index}`}
                className="group min-w-[190px] overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:min-w-[210px]"
              >
                <div className="relative h-[150px] bg-zinc-50">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain !p-3 transition-all duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="!p-4">
                  <h3 className="text-sm font-medium text-zinc-800">
                    {product.name}
                  </h3>

                  <p className="!mt-1 text-base font-bold text-zinc-950">
                    {product.price}
                  </p>
                </div>
              </a>
            ))}
          </div>

          <button
            onClick={scrollRight}
            className="absolute -right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-all duration-200 hover:scale-110"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default MostWantedCarousel;