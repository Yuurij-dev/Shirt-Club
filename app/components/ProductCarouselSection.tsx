"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const bestSellers = [
  {
    name: "Camisa Flamengo Home 24/25",
    price: "R$ 189,90",
    image: "/products/flamengo-home.png",
  },
  {
    name: "Camisa Real Madrid Home 24/25",
    price: "R$ 189,90",
    image: "/products/real-madrid-home.png",
  },
  {
    name: "Camisa Palmeiras Home 24/25",
    price: "R$ 189,90",
    image: "/products/palmeiras-home.png",
  },
  {
    name: "Camisa Barcelona Home 24/25",
    price: "R$ 189,90",
    image: "/products/barcelona-home.png",
  },
];

const retroProducts = [
  {
    name: "Camisa Brasil Retrô 1994",
    price: "R$ 179,90",
    image: "/products/brasil-retro.png",
  },
  {
    name: "Camisa Corinthians Retrô 2012",
    price: "R$ 179,90",
    image: "/products/corinthians-retro.png",
  },
  {
    name: "Camisa Milan Retrô 96/99",
    price: "R$ 189,90",
    image: "/products/milan-retro.png",
  },
  {
    name: "Camisa Vasco Retrô 1997",
    price: "R$ 179,90",
    image: "/products/vasco-retro.png",
  },
  
];

type Product = {
  name: string;
  price: string;
  image: string;
};

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="min-w-[180px] rounded-xl bg-zinc-50 !p-4 transition-all duration-200 hover:shadow-md">
      <div className="flex h-[170px] items-center justify-center">
        <Image
          src={product.image}
          alt={product.name}
          width={150}
          height={150}
          className="h-[150px] w-auto object-contain transition-all duration-300 hover:scale-105"
        />
      </div>

      <h3 className="!mt-3 text-sm font-medium text-zinc-800">
        {product.name}
      </h3>

      <p className="!mt-1 text-base font-bold text-zinc-950">
        {product.price}
      </p>
    </div>
  );
};

const ProductCarousel = ({
  title,
  products,
}: {
  title: string;
  products: Product[];
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({
      left: -220,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({
      left: 220,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="!mb-5 flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-bebas)] text-4xl text-zinc-950">
          {title}
        </h2>

        <a href="#" className="text-sm font-medium text-zinc-700 hover:underline">
          Ver todos ›
        </a>
      </div>

      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute -left-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-hidden scroll-smooth"
        >
          {products.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute -right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

const ProductCarouselSection = () => {
  return (
    <section className="w-full bg-white !py-8">
      <div className="container !mx-auto">
        <div className="grid grid-cols-2 gap-8">
          <ProductCarousel title="MAIS VENDIDOS" products={bestSellers} />
          <ProductCarousel title="RETRO" products={retroProducts} />
        </div>
      </div>
    </section>
  );
};

export default ProductCarouselSection;